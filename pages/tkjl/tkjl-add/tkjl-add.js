const app = getApp()
Page({
  data: {
    // 保存权限
    hasBcAuth: false,
    // 学校显示隐藏
    schoolShow: true,
    // 过程记录显示隐藏
    ddjsShow: false,
    // 综合评价显示隐藏
    zhpjShow:false,
    // 学校(校园)数据
    xx: {
    	name: '',
    	value: ''
    },
    // 听课记录表单数据
    data: {
      'MB_ORG_ID': '', // 学校id
      'YWSJ': '', // 业务时间
      'JSMC': '', // 教师名称
      'BJ': '', // 班级
      'XK': '', // 学科
      'GCJL': '', // 过程记录
      'FZ': 0, // 分值 定性评价
      'ZHPJ': '', // 综合评价
      'MB_ORG_MC': '', // 学校名称
      'MXID': '' ,// 此条记录的ID
      minDate: "", // 功能时间限制
      maxDate: "", // 功能时间限制
    },
    startDate: '', // 可填写的最小时间,别放在date对象里,而且一定要事先创建好变量并给时间
    endDate: '', // 可填写的最大时间,别放在date对象里,而且一定要事先创建好变量并给时间
    tbmbglData: {}, // 老记录模板数据
    isNew:"1",
  },
  onLoad(query){
    this.data.data.MXID = query.id
    this.data.isNew = query.isNew
    if (this.data.isNew !== "1" && this.data.data.MXID) {
      this.data.tbmbglData.MBNR="因系统升级，此记录请于电脑端修改"
    }else{
      this.initPage()
    }
    this.getdateImpose()
    this.has()
  },
  // 初始化页面
  initPage(){
    // 有id就是修改，就事先获取数据
    if(this.data.data.MXID) {
      app.$kwz.ajax.ajaxUrl({
        url: 'jc_pgbzmx/doSelectByPrimary/TKJL',
        type: 'POST',
        data: {
          MXID: this.data.data.MXID
        },
        page: this,
        then (response) {
          let data = response.datas
          data.YWSJ = (data.YWSJ.substr(0, 10))
          this.setData({data})
        }
      })
    }else{
      this.data.data.YWSJ = app.$kwz.formatDate()
      this.setData({data: this.data.data})
    }
  },
  has(){
    app.$kwz.hasAuth('jc_pgbzmx/doAddTkjl/TKJL',(auth)=>{
      auth ? this.setData({hasBcAuth: auth}) : ""
    })
  },
  // 获取日期限制
  getdateImpose(){
    app.$kwz.dateImpose('cd5235ad9e2d463a9af919de06dcfb06',(date)=>{
      this.data.data.minDate = date.minDate
      this.data.data.maxDate = date.maxDate
      this.setData({
        startDate: app.$kwz.getLimdat(date.minDate),
        endDate: app.$kwz.getLimdat(date.maxDate),
      })
    })
  },
  // 点击保存按钮
  save(){
    if (!this.data.data.MB_ORG_MC || !this.data.data.YWSJ || !this.data.data.BJ || !this.data.data.XK || !this.data.data.JSMC) {
      app.$kwz.alert('学校，听课日期，听课班级，听课学科，听课教师中不能有空')
      return false
    } else if (!this.data.data.GCJL || this.data.data.FZ < 1 || !this.data.data.ZHPJ) {
      app.$kwz.alert('过程记录，定性评价，综合评价中不能有空')
      return false
    }
    if (this.data.data.MXID) {
      this.doUpdate()
    } else {
      this.doAdd()
    }
  },
  // 保存ajax
  doAdd() {
    app.$kwz.ajax.ajaxUrl({
      url: 'jc_pgbzmx/doAddTkjl/TKJL',
      type: 'POST',
      page: this,
      data: {
        'XXMC': this.data.data.MB_ORG_ID, // 字段名是学校名称 传的其实是学校id(后端取错
        'YWSJ': this.data.data.YWSJ, // 业务时间
        'JSMC': this.data.data.JSMC, // 教师名称
        'BJ': this.data.data.BJ, // 班级
        'XK': this.data.data.XK, // 学科
        'GCJL': this.data.data.GCJL, // 过程记录
        'FZ': String(this.data.data.FZ), // 分值 定性评价 12345字符串数值 0就是没填，不能提交
        'ZHPJ': this.data.data.ZHPJ, // 综合评价
        minDate: this.data.data.minDate,
        maxDate: this.data.data.maxDate
      },
      then (response) {
        wx.redirectTo({ url: '/pages/tkjl/tkjl' })
        app.$kwz.alert('保存成功')
      }
    })
  },
  // 修改
  doUpdate () {
    app.$kwz.ajax.ajaxUrl({
      url: 'jc_pgbzmx/doUpdateTkjl/TKJL',
      type: 'POST',
      page: this,
      data: {
        'XXMC': this.data.data.MB_ORG_ID, // 字段名是学校名称 传的其实是学校id(后端取错名
        'YWSJ': this.data.data.YWSJ, // 业务时间
        'JSMC': this.data.data.JSMC, // 教师名称
        'BJ': this.data.data.BJ, // 班级
        'XK': this.data.data.XK, // 学科
        'GCJL': this.data.data.GCJL, // 过程记录
        'FZ': String(this.data.data.FZ), // 分值 定性评价 12345字符串数值 0就是没填，不能提交
        'ZHPJ': this.data.data.ZHPJ, // 综合评价
        'MXID': this.data.data.MXID,
        minDate: this.data.data.minDate,
        maxDate: this.data.data.maxDate
      },
      then (response) {
        wx.redirectTo({ url: '/pages/tkjl/tkjl' })
        app.$kwz.alert('保存成功')
      }
    })
  },
  // 学校确定
  confirmSchool(e) {
    this.data.data.MB_ORG_MC = e.detail.data.name;
    this.data.data.MB_ORG_ID = e.detail.data.value;
    this.setData({
      schoolShow: !this.data.schoolShow,
      data: this.data.data
    })
  },
  // 打开关闭 学校
  showSchool(e) {
    if (!this.data.data.MXID){
      this.setData({ schoolShow: !this.data.schoolShow })
    }
  },
  // 修改业务时间
  changeYwsj({detail}) {
    this.data.data.YWSJ = detail.value
    this.setData({ data: this.data.data})
  },
  // 修改 听课班级 听课学科 听课教师
  inputBj({detail }){
    this.data.data.BJ = detail.value
    this.setData({ data: this.data.data})
  },
  inputXk({detail }){
    this.data.data.XK = detail.value
    this.setData({ data: this.data.data})
  },
  inputJsmc({detail }){
    this.data.data.JSMC = detail.value
    this.setData({ data: this.data.data})
  },
  //打开关闭 过程记录 综合评价
  changeDdjsShow(){
    this.setData({ ddjsShow: !this.data.ddjsShow })
  },
  changeZhpjShow(){
    this.setData({ zhpjShow: !this.data.zhpjShow })
  },
  // 修改 定性评价
  changeDxpj({detail}){
    this.data.data.FZ = detail.index
    this.setData({data: this.data.data})
  },
  // 修改 过程记录
  gcjlInput({ detail }) {
    this.data.data.GCJL = detail.data
  },
  // 更改 综合评价 值
  inputZhpj({ detail }){
    this.data.data.ZHPJ = detail.value
  },
})