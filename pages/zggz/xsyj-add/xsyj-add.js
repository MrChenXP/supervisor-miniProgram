const app = getApp()
Page({
  data: {
    // 发送 审核 权限
    hasFsAuth: false,
    hasShAuth: false,
    formData: {
      BH: '',
      XXMC: '',
      XS_ORG: '',
      YWSJ: '',
      XSNR: '',
      ZGXSID: '',
      XS_ORG:{},
    },
    ksList: [],
    // 学校显示隐藏
    schoolShow: true,
    // 整改详情显示隐藏
    xsyjShow:false,
    // 日期限制
    minDate:"",
    maxDate:"",
    // 页面日期限制
    startDate:"",
    endDate:"",
  },
  onLoad(query) {
    app.$kwz.getLoginUser((e)=>{
      this.data.loginUser = e
      this.setData({ loginUser: this.data.loginUser })
    })
    this.data.formData.ZGXSID = query.ZGXSID
    this.initPage()
    this.has()
  },
  // 初始化页面
  initPage(){
    // 判断来源(是否是审核) 获取id并预先加载数据
    if (this.data.formData.ZGXSID) {
      this.loadData()
    } else {
      this.loadBh()
      // 默认当前时间
      this.data.formData.YWSJ = !this.data.formData.YWSJ ? app.$kwz.formatDate() : this.data.formData.YWSJ,
      this.setData({ formData: this.data.formData })
      this.loadKsList()
    }
    this.getdateImpose()
  },
  // 预先加载数据
  loadData() {
    app.$kwz.ajax.ajaxUrl({
      url: 'dd_zgxs/doSelectByPrimary',
      type: 'POST',
      data: {
        ZGXSID: this.data.formData.ZGXSID
      },
      page: this,
      then (response) {
        let datas = response.datas
        this.data.formData.BH = datas.BH
        this.data.formData.XXMC = datas.XXMC
        this.data.formData.YWSJ = datas.YWSJ
        this.data.formData.XSNR = datas.XSNR
        this.data.formData.XS_ORG.name = datas.XS_ORG
        this.data.formData.XS_ORG.value = datas.XS_ORG_ID
        this.setData({ formData: this.data.formData})
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
  // 获取编号
  loadBh(){
    app.$kwz.ajax.ajaxUrl({
      url: '/dd_zgxs/getNowTimeString',
      type: 'POST',
      page: this,
      then (response) {
        let datas = response.datas
        if (datas && datas.BH) {
          this.data.formData.BH = datas.BH
          this.setData({ formData: this.data.formData})
        }
      }
    })
  },
  // 加载科室选择列表
  loadKsList() {
      app.$kwz.ajax.ajaxUrl({
        url: 'ddjl/getKsList',
        type: 'POST',
        page: this,
        then (response) {
          let datas = response.datas.KSLIST
          let ksList = []
          if (datas && datas && datas.length > 0) {
            for (let i = 0; i < datas.length; i++) {
              ksList.push({
                value: datas[i].ORG_ID,
                name: datas[i].ORG_MC
              })
            }
          } else {
            ksList.push({
              name: '暂无数据',
              value: ''
            })
          }
          this.setData({ ksList })
        }
      })
    },
  // 按钮权限
  has(){
    app.$kwz.hasAuth('dd_zgxs/doAddtzyj', (auth) => {
      auth ? this.setData({ hasFsAuth: auth }) : ""
    })
    app.$kwz.hasAuth('dd_zgxs/xsyj_sh', (auth) => {
      auth ? this.setData({ hasShAuth: auth }) : ""
    })
  },
  // 发送/审核ajax 有整改id就是审核
  sendZg() {
    if (!this.data.formData.XXMC || !this.data.formData.XS_ORG.name || !this.data.formData.YWSJ || !this.data.formData.XSNR || !this.data.formData.BH ) {
      app.$kwz.alert('请填写学校、科室、时间、问题、编号')
      return
    }
    if (this.data.formData.ZGXSID) {
      app.$kwz.ajax.ajaxUrl({
        url: 'dd_zgxs/doUpdate/XSYJ',
        type: 'POST',
        data: {
          CMS_LMTYPE: '1',
          ZGXSID: this.data.formData.ZGXSID,
          CLLX: '22',
          XSNR: this.data.formData.XSNR,
        },
        page: this,
        then (response) {
          wx.redirectTo({ url: '/pages/zggz/xsyj/xsyj' })
          app.$kwz.alert('审核成功')
        }
      })
    } else {
      app.$kwz.ajax.ajaxUrl({
        url: 'dd_zgxs/doAddtzyj',
        type: 'POST',
        data: {
          BH: this.data.formData.BH,
          ZGXSDM: '2',
          ZGXSMC: '协商意见',
          ZGXSLY: 3, // 先写死整改来源
//          ZGXSLYMC: this.$kwz.getPopupName(this.zgList, this.data.zgValue[0], 'value', 'name'), //如果不是写死在注释回来
          ZGXSLYMC: '其他整改',
          ORG_ID_TARGET: this.data.formData.ORG_ID_TARGET,
          XS_ORG_ID: this.data.formData.XS_ORG.value,
          YWSJ: this.data.formData.YWSJ,
          XSNR: this.data.formData.XSNR,
          YWID: '',
          minDate: this.data.formData.minDate,
          maxDate: this.data.formData.maxDate
        },
        page: this,
        then (response) {
          wx.redirectTo({ url: '/pages/zggz/xsyj/xsyj' })
          app.$kwz.alert('发送成功')
        }
      })
    }
  },
  // 修改业务时间
  changeYwsj({detail}) {
    this.data.formData.YWSJ = detail.value
    this.setData({ formData: this.data.formData})
  },
  // 修改编号
  inputBh({detail }){
    this.data.formData.BH = detail.value
    this.setData({ formData: this.data.formData})
  },
  // 学校确定
  confirmSchool(e) {
    this.data.formData.XXMC = e.detail.data.name;
    this.data.formData.ORG_ID_TARGET = e.detail.data.value;
    this.setData({
      schoolShow: !this.data.schoolShow,
      formData: this.data.formData
    })
  },
  // 打开关闭 学校
  showSchool(e) {
    if(!this.data.formData.ZGXSID){
      this.setData({ schoolShow: !this.data.schoolShow })
    }
  },
  // 更改科室
  changeKs({detail}) {
  	let i = detail.value
    this.data.formData.XS_ORG = this.data.ksList[i]
    this.setData({formData: this.data.formData})
  },
  // 更改 存在问题 值
  changeCzwt({detail}){
    this.data.formData.XSNR = detail.value
  },
})