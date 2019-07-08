const app = getApp()
Page({
  data: {
    // 学校显示隐藏
    schoolShow:true,
    // 随行督学显示隐藏
    sxdxShow:true,
    // 学校(校园)数据
    xx: {
      name: '',
      value: ''
    },
    // 表单数据
    formData: {
      xxName: '',
      xxId: '',
      YWSJ: '',
      sdValue: [],
      sxdxName: '',
      sxdxId: '',
      ddsxTxt: '',
      pgbzValue: [],
      remark: '',
      xqid: ''
    },
    startDate: '', // 可填写的最小时间,别放在date对象里,而且一定要事先创建好变量
    endDate: '', // 可填写的最大时间,别放在date对象里,而且一定要事先创建好变量
    // 业务时间
    ywsj:"",
    // 时段列表
    sdList:[],
    // 时段值
    sdValue:{
      name: '',
      value: '',
      index: 0
    },
    // 随行督学
    sxdx: {
      name: '',
      value: '',
      index: 0
    },
    // 评估标准名字列表 规定任务评价
    pjList:[],
    // 评估标准值
    pjValue: {
      name: '',
      value: '',
      index: 0
    },
    // 督导事项显示隐藏
    ddsxShow: true,
    // 督导事项
    ddsx: {},
    // 当前学期id
    xqid: '',
    remark: '',
    // 登陆用户
    loginUser: {},
    // 工作计划id
    contentId: '',
    // 最大最小时间限制 保存用
    minDate:"",
    maxDate:""
  },
  onLoad(param) {
    this.getdateImpose()
    if(param && param.CONTENT_ID) {
      this.data.contentId = param.CONTENT_ID
    } else {
      this.getXqid()
    }
    this.init()
  },
  // 获取日期限制
  getdateImpose(){
    app.$kwz.dateImpose('b892eba5fae9493189ac81a510bbbd73',(date)=>{
      this.data.minDate = date.minDate
      this.data.maxDate = date.maxDate
      this.setData({
        startDate: app.$kwz.getLimdat(date.minDate),
        endDate: app.$kwz.getLimdat(date.maxDate),
      })
    })
  },
  // 加载当前学期id
  getXqid(){
    app.$kwz.ajax.ajaxUrl({
      url: '/jc_xq/getCurXq',
      type: 'POST',
      page: this,
      then (response) {
        let datas = response.datas
        if (datas && datas.curXq) {
          this.data.xqid = datas.curXq.XQ_ID
        }
      }
    })
  },
  // 初始化页面
  init(){
    // 时段代码
    app.$kwz.loadDms('DM_SD', dms =>{
      this.setData({ sdList: app.$kwz.copyJson(dms.DM_SD) || {}  })
      // 评估标准
      app.$kwz.ajax.ajaxUrl({
        url: '/dd_gzap/doSelectPgbz/DDPGBZ',
        type: 'POST',
        data: {
          'YWLX': 'DDPGBZ',
          'DDPGBZ': 'DDPGBZ'
        },
        page: this,
        then (response) {
          let datas = response.datas
          let pgbzList = []
          if (datas && datas.length > 0) {
            for (let i = 0; i < datas.length; i++) {
              pgbzList.push({
                name: datas[i].BZMC,
                value: datas[i].BZID
              })
            }
          } else {
            pgbzList.push({
              name: '暂无记录',
              value: ''
            })
          }
          this.setData({pjList: pgbzList})
          this.loadData()
        }
      })
    })
    app.$kwz.getLoginUser((user)=>{
      this.data.loginUser = user
    })

  },
  // 加载工作安排
  loadData () {
    app.$kwz.ajax.ajaxUrl({
      url: '/dd_gzap/doSelectByPrimary/DDGZAP',
      type: 'POST',
      data: {
        CONTENT_ID: this.data.contentId
      },
      page: this,
      then (response) {
        let datas = response.datas
        if (datas && datas.map) {
          console.log(datas)
          let map = datas.map
          this.data.xx.name = map.ORG_ID_TARGET_MC
          this.data.xx.value = map.ORG_ID_TARGET
          this.data.ywsj = (map.YWSJ && map.YWSJ.length > 10 ? map.YWSJ.substr(0, 10) : '')
          this.data.sdValue.value = map.SD
          for(let i = 0; i < this.data.sdList.length; i++) {
            if(this.data.sdList[i].DMMX_CODE == map.SD) {
              this.data.sdValue.name = this.data.sdList[i].DMMX_MC
              this.data.sdValue.index = i
            }
          }
          this.data.sxdx.name = map.JGID_MC
          this.data.sxdx.value = map.JGID
          // 没有标准id返回null 需要处理
          this.data.pjValue.value = map.BZID || ""
          for(let i = 0; i < this.data.pjList.length; i++) {
            if(this.data.pjList[i].value == map.BZID) {
              this.data.pjValue.name = this.data.pjList[i].name
              this.data.pjValue.index = i
            }
          }
          this.data.formData.ddsxTxt = map.TXT
          this.data.xqid = map.XQID
          this.setData({
            xx: this.data.xx,
            ywsj: this.data.ywsj,
            sdValue: this.data.sdValue,
            sxdx: this.data.sxdx,
            pjValue: this.data.pjValue,
            pjList: this.data.pjList,
            formData: this.data.formData,
            xqid: this.data.xqid,
          })
        }
      }
    })
  },
  // 保存提交工作计划
  saveGzjh () {
    if (!this.data.xx.value || !this.data.ywsj || !this.data.sdValue.value) {
      app.$kwz.alert('学校、时间、时段为必填项')
      return
    }
    if (this.data.contentId) {
      this.doUpdate()
    } else {
      this.doAdd()
    }
  },
  // 新增
  doAdd () {
    app.$kwz.ajax.ajaxUrl({
      url: '/dd_gzap/doAdd/DDGZAP',
      type: 'POST',
      data: {
        CONTENT_TYPE: 'DDGZAP',
        XQID: this.data.xqid,
        STATUS: '1',
        GROUP_ARR: `[{
          "xxid": "${this.data.xx.value}",
          "xxmc": "${this.data.xx.name}",
          "jgid": "${this.data.sxdx.value}",
          "jgmc": "${this.data.sxdx.name}",
          "ywsj": "${this.data.ywsj}",
          "sd": "${this.data.sdValue.value}",
          "minDate": ${this.data.minDate},
          "maxDate": ${this.data.maxDate}
        }]`,
        TXT: this.data.formData.ddsxTxt,
        REMARK: this.data.remark,
        BZID: this.data.pjValue.value,
        ORG_ID: this.data.xx.value,
        AUTHOR: this.data.loginUser.name
      },
      page: this,
      then (response) {
        wx.navigateTo({ url: '/pages/gzjh/gzjh' })
        app.$kwz.alert('保存成功')
      }
    })
  },
  // 修改
  doUpdate() {
    app.$kwz.ajax.ajaxUrl({
      url: '/dd_gzap/doUpdate',
      type: 'POST',
      data: {
        CONTENT_ID: this.data.contentId,
        XQID: this.data.xqid,
        ORG_ID: this.data.xx.value,
        JGID: this.data.sxdx.value,
        JGID_MC: this.data.sxdx.name,
        YWSJ: this.data.ywsj,
        SD: this.data.sdValue.value,
        TXT: this.data.formData.ddsxTxt,
        BZID: this.data.pjValue.value,
        minDate: this.data.minDate,
        maxDate: this.data.maxDate,
        end_time:"",
        start_time:"",
          CURR_APP_ID:"56FDFCB3323E293AE0530100007FF7B0",
          CURR_U_ID:"78304456e6f0404cbb1bd7fffc664a41",
      },
      page: this,
      then (response) {
        console.log(response)
        wx.navigateTo({ url: '/pages/gzjh/gzjh' })
        app.$kwz.alert('保存成功')
      }
    })
  },
  // 打开关闭 学校 随行督学 督导事项
  showSchool(e) {
    if(!this.data.contentId){
      this.setData({ schoolShow: !this.data.schoolShow })
    }
  },
  showSxdx(e) {
    this.setData({ sxdxShow: !this.data.sxdxShow })
  },
  ddsxShow(){
    this.setData({ ddsxShow: !this.data.ddsxShow })
  },
  // 学校确定
  confirmSchool(e) {
    this.data.xx.name= e.detail.data.name;
    this.data.xx.value= e.detail.data.value;
    this.setData({
      schoolShow: !this.data.schoolShow,
      xx: this.data.xx
    })
  },
  // 随行督学确定
  sxdxConfirm(e) {
    let sxDxList = e.detail.data
    let sxdxIds = []
    let sxdxNames = []
    if (sxDxList && sxDxList.length > 0) {
      for (let i = 0; i < sxDxList.length; i++) {
        sxdxIds.push(sxDxList[i].value)
        sxdxNames.push(sxDxList[i].name)
      }
    }
    this.data.sxdx.name= sxdxNames.join(',')
    this.data.sxdx.value= sxdxIds.join(',')
    this.setData({
      sxdxShow: !this.data.sxdxShow,
      sxdx: this.data.sxdx
    })
  },
  // 修改业务时间
  changeYwsj(e) {
    this.data.ywsj = e.detail.value
    this.setData({ ywsj: this.data.ywsj })
  },
  // 选择搜索条件 => 时段
  changeSd(e) {
    let checkedOption = this.data.sdList[e.detail.value]
    this.data.sdValue.value = checkedOption.DMMX_CODE
    this.data.sdValue.name = checkedOption.DMMX_MC
    this.setData({
      sdValue: this.data.sdValue
    })
  },
  // 督导纪实修改
  ddsxInput({ detail }) {
    this.data.formData.ddsxTxt = detail.data
  },
})