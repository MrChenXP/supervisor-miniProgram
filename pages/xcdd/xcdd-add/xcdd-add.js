// pages/xcdd/xcdd-add/xcdd-add.js
const app = getApp()
Page({
  data: {
    // 工作计划,学校,随行督学选择页面 后续处理意见 显示隐藏
    gzjhShow: true,
    schoolShow: true,
    sxdxShow: true,
    hxclyjShow: false,
    // 督导纪实 资料采集 经验做法 存在问题 显示隐藏
    ddjsShow: false,
    zlcjShow: true,
    jyzfShow: true,
    czwtShow: true,   
    // 页面数据
    data:{
      ywsj: "", // 业务时间 督导时间
      gzjhName: "", // 工作计划名字
      gzjhId: "", // 工作计划Id
      schoolName: "", // 学校名字
      schoolId: "", // 学校Id
      sxdxName: "", // 随行督学名字
      sxdxId: "", // 随行督学Id
    },
    // 督导纪实id
    contentId: '',
    // 登录用户数据
    loginUser: {},
  },
  onLoad (param) {
    if (param) {
      if (param.CONTENT_ID) {
        this.data.contentId = param.CONTENT_ID
        this.loadData()
      } else if (param.workplanId) {
        this.data.gzjh.value = param.workplanId
        this.loadDdGzjh()
      }
    }
    app.$kwz.getLoginUser((e)=>{
      this.data.loginUser = e
      this.data.data.sxdxName = e.name
      this.data.data.sxdxId = e.uid
      this.setData({ data: this.data.data })
    })
  },
  // 工作计划确定
  confirmGzjh(e) {
    let gzjh = e.detail.data
    // 随行督学传的是用户id
    if (gzjh) {
      this.data.data.gzjhId = gzjh.value
      this.data.data.schoolName = gzjh.data.XXMC
      this.data.data.schoolId = gzjh.data.ORG_ID_TARGET
      this.data.data.sxdxName = gzjh.data.CJID_MC || ""
      this.data.data.sxdxId = gzjh.data.CJID
      this.data.data.ywsj = gzjh.data.YWSJ && gzjh.data.YWSJ.length > 10 ? gzjh.data.YWSJ.substr(0, 10) : app.$kwz.formatDate('yyyy-MM-dd')
      let gzjhMc = `${this.data.data.schoolName}/${this.data.data.sxdxName}/${this.data.data.ywsj}`
      this.data.data.gzjhName = gzjhMc.length > 20 ? (gzjhMc.substr(0, 19) + '...') : gzjhMc
      // 下面还有个获取标准
    }
    this.setData({ 
      gzjhShow: !this.data.gzjhShow,
      data: this.data.data
    })
  },
  // 学校确定
  confirmSchool(e) {
    this.data.data.schoolName = e.detail.data.name;
    this.data.data.schoolId = e.detail.data.value;
    this.setData({
      schoolShow: !this.data.schoolShow,
      data: this.data.data
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
    this.data.data.sxdxName = sxdxNames.join(',')
    this.data.data.sxdxId = sxdxIds.join(',')
    this.setData({
      sxdxShow: !this.data.sxdxShow,
      data: this.data.data
    })
  },
  // 打开关闭 工作计划 学校 随行督学
  showGzjh(e){
    this.setData({ gzjhShow: !this.data.gzjhShow })
  },
  showSchool(e) {
    this.setData({ schoolShow: !this.data.schoolShow })
  },
  showSxdx(e) {
    this.setData({ sxdxShow: !this.data.sxdxShow })
  },
  showHxclyj(e) {
    this.setData({ hxclyjShow: !this.data.hxclyjShow })
  },
  // 修改业务时间
  changeYwsj(e) {
    this.data.data.ywsj = e.detail.value
    this.setData({ data: this.data.data })
  },
  //更改 督导纪实 资料采集 经验做法 存在问题 显示隐藏
  changeDdjsShow(){
    this.setData({ ddjsShow: !this.data.ddjsShow })
  },
  changeZlcjShow() {
    this.setData({ zlcjShow: !this.data.zlcjShow })
  },
  changeJyzfShow() {
    this.setData({ jyzfShow: !this.data.jyzfShow })
  },
  changeCzwtShow() {
    this.setData({ czwtShow: !this.data.czwtShow })
  },
  
})