const app = getApp()
Page({
  data: {
    // 发送 审核 权限
    hasFsAuth: false,
    hasShAuth: false,
    // 学校显示隐藏
    schoolShow: true,
    // 表单数据
    data: {
      BH: '',
      ORG_ID_TARGET: '',  // 学校id
      XXMC: '', // 学校名称
      YWSJ: '', // 业务时间
      XSNR: '', // 协商内容
      CLQX: 3, // 处理期限
      zgValue: [],
      ZGXSID: ''
    },
    // 存在问题值
    czwt:"",
    //用户数据
    loginUser:{},
    // 日期限制
    minDate:"",
    maxDate:"",
    // 页面日期限制
    startDate:"",
    endDate:"",
  },
  onLoad(query) {
    app.$kwz.getLoginUser((e)=>{
      this.setData({ loginUser: e })
    })
    this.data.data.ZGXSID = query.ZGXSID
    this.initPage()
    this.has()
  },
  // 初始化页面
  initPage(){
    // 判断来源(是否是审核) 获取id并预先加载数据
    if (this.data.data.ZGXSID) {
      this.loadData()
    } else {
      this.loadBh()
      // 默认当前时间
      this.data.data.YWSJ = !this.data.data.YWSJ ? app.$kwz.formatDate() : this.data.data.YWSJ
      // 加载整改类型代码
      app.$kwz.loadDms('DM_DD_ZGXSLY', dms => {
        this.data.data.zgList = dms.DM_DD_ZGXSLY
      })
      this.setData({ data: this.data.data })
    }
    this.getdateImpose()
  },
  // 预先加载数据
  loadData () {
    app.$kwz.ajax.ajaxUrl({
      url: 'dd_zgxs/doSelectByPrimary',
      type: 'POST',
      data: {
        ZGXSID: this.data.data.ZGXSID
      },
      page: this,
      then (response) {
        let datas = response.datas
        this.data.data.BH = datas.BH
        this.data.data.XXMC = datas.XXMC
        this.data.data.YWSJ = datas.YWSJ
        this.data.data.XSNR = datas.XSNR
        this.data.data.CLQX = datas.CLQX
        this.setData({ data: this.data.data})
      }
    })
  },
  // 获取编号
  loadBh(){
    app.$kwz.ajax.ajaxUrl({
      url: '/dd_zgxs/getNowTimeString',
      type: 'POST',
      page: this,
      then (response) {
        let datas = response.datas
        if (datas && datas.BH) {
          this.data.data.BH = datas.BH
          this.setData({ data: this.data.data})
        }
      }
    })
  },
  // 获取日期限制
  getdateImpose(){
    app.$kwz.dateImpose('3758a16aa4e14b3d87bb1f9c7e2fc509',(date)=>{
      this.data.minDate = date.minDate
      this.data.maxDate = date.maxDate
      this.setData({
        startDate: app.$kwz.getLimdat(date.minDate),
        endDate: app.$kwz.getLimdat(date.maxDate),
      })
    })
  },
  // 发送/审核ajax 有整改id就是审核
  sendZg() {
    if (!this.data.data.XXMC || !this.data.data.YWSJ || !this.data.data.XSNR || !this.data.data.BH || !this.data.data.CLQX) {
      app.$kwz.alert('请填写学校、时间、问题、编号、整改期限')
      return
    }
    if (this.data.data.ZGXSID) {
      app.$kwz.ajax.ajaxUrl({
        url: 'dd_zgxs/doUpdate/ZGTZ',
        type: 'POST',
        data: {
          CMS_LMTYPE: '2',
          ZGXSID: this.data.data.ZGXSID,
          CLLX: '2',
          XSNR: this.data.data.XSNR,
          CLQX: this.data.data.CLQX
        },
        page: this,
        then (response) {
          wx.redirectTo({ url: '/pages/zggz/zggz' })
          app.$kwz.alert('审核成功')
        }
      })
    } else {
      app.$kwz.ajax.ajaxUrl({
        url: 'dd_zgxs/doAddtzyj',
        type: 'POST',
        data: {
          BH: this.data.data.BH,
          YWID: '',
          ZGXSDM: '1',
          ZGXSMC: '整改通知',
          ZGXSLY: 3, // 先写死整改来源
//          ZGXSLYMC: this.$kwz.getPopupName(this.zgList, this.data.zgValue[0], 'value', 'name'), //如果不是写死在注释回来
          ZGXSLYMC: '其他整改',
          ORG_ID_TARGET: this.data.data.ORG_ID_TARGET,
          CLQX: this.data.data.CLQX,
          YWSJ: this.data.data.YWSJ,
          XSNR: this.data.data.XSNR,
          minDate: this.data.data.minDate,
          maxDate: this.data.data.maxDate
        },
        page: this,
        then (response) {
          wx.redirectTo({ url: '/pages/zggz/zggz' })
          app.$kwz.alert('发送成功')
        }
      })
    }

  },
  // 修改业务时间
  changeYwsj({detail}) {
    this.data.data.YWSJ = detail.value
    this.setData({ data: this.data.data})
  },
  // 修改编号
  inputBh({detail }){
    this.data.data.BH = detail.value
    this.setData({ data: this.data.data})
  },
  // 更改 存在问题 值
  changeCzwt({detail}){
    this.data.data.XSNR = detail.value
  },
  // 更改 处理期限 值
  changeClqx({ detail }){
    this.data.data.CLQX  = detail.value
    this.setData({ data: this.data.data })
  },
  // 按钮权限判断
  has(){
    app.$kwz.hasAuth('dd_zgxs/doAddtzyj', (auth) => {
      auth ? this.setData({ hasFsAuth: auth }) : ""
    })
    app.$kwz.hasAuth('dd_zgxs/zgtz_sh', (auth) => {
      auth ? this.setData({ hasShAuth: auth }) : ""
    })
  },
  // 学校确定
  confirmSchool(e) {
    this.data.data.XXMC = e.detail.data.name;
    this.data.data.ORG_ID_TARGET = e.detail.data.value;
    this.setData({
      schoolShow: !this.data.schoolShow,
      data: this.data.data
    })
  },
  // 打开关闭 学校
  showSchool(e) {
    if (!this.data.data.ZGXSID){
      this.setData({ schoolShow: !this.data.schoolShow })
    }
  },
})