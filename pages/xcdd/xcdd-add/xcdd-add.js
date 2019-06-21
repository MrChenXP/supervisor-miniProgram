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
    ddjsShow: true,
    zlcjShow: true,
    jyzfShow: true,
    czwtShow: true,   
    // 页面数据
    data:{
      ywsj: "", // 业务时间 督导时间
      gzjhName: "", // 工作计划名字
      gzjhId: "", // 工作计划Id
      xqid: "", // 学期id
      schoolName: "测试后续处理意见的学校", // 学校名字
      schoolId: "", // 学校Id
      sxdxName: "", // 随行督学名字
      sxdxId: "", // 随行督学Id
      ddjs:"", // 督导纪实内容
      cyzl: 0, // 查阅资料
      lxhy: 0, // 列席会议
      ztzf: 0, // 座谈走访
      wjdc: 0, // 问卷调查
      xyxs: 0, // 校园巡视
      dxjyzf: "", // 典型经验做法
      czwt: "", // 存在问题
      contentId: "", // 督导纪实id
      status: "1", // 后续处理意见状态
      status_mc: '无意见', // 后续处理意见状态名称
      zgxsyj: "", // 整改建议，当STATUS=4，即后续处理意见选择 小问题 时，不能为空必传，其余状态时为空
      zgxsid: "", // 整个协商id STATUS=2或3或5时 不能为空必传
      pgid: "", //评估id，点了“去评估”才有，否则为空
      minDate: "", // 最小时间限制
      maxDate: "", // 最大时间限制
    },
    
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
  // 保存督导
  saveXcdd(sfXq) {
    if (!this.data.data.schoolName || !this.data.data.ywsj || !this.data.data.ddjs) {
      app.$kwz.alert('学校、时间、督导纪实为必填项')
      return
    }
    // 如果没有选择工作计划,则学期id会为空,那么默认取当前学期
    if (!this.data.data.xqid) {
      app.$kwz.ajax.ajaxUrl({
        url: '/jc_xq/getCurXq',
        type: 'POST',
        page: this,
        then(response) {
          let datas = response.datas
          if (datas && datas.curXq && datas.curXq.XQ_ID) {
            this.data.data.xqid = datas.curXq.XQ_ID
            this.sendSaveXcdd()            
          }
        }
      })
    } else {
      this.sendSaveXcdd()
    }
  },
  // 保存督导的ajax
  sendSaveXcdd(){
    app.$kwz.ajax.ajaxUrl({
      url: '/ddjl/doEdit',
      type: 'POST',
      page: this,
      data: {
        CONTENT_ID: this.data.data.contentId || "",
        ORG_ID: this.data.data.schoolId,
        XXMC: this.data.data.schoolName,
        YWSJ: this.data.data.ywsj,
        USERID: this.data.data.sxdxId,
        USERID_MC: this.data.data.sxdxName,
        DDJS: this.data.data.ddjs,
        CYZL: this.data.data.cyzl,
        LXHY: this.data.data.lxhy,
        ZTZF: this.data.data.ztzf,
        WJDC: this.data.data.wjdc,
        XYXS: this.data.data.xyxs,
        DXJY: this.data.data.dxjyzf,
        CZWT: this.data.data.czwt,
        GZAP_YWID: this.data.data.gzjhId,
        XQID: this.data.data.xqid,
        STATUS: this.data.data.status,
        STATUS_MC: this.data.data.status_mc,
        ZGJY: this.data.data.zgxsyj,
        ZGXSID: this.data.data.zgxsid,
        PGMC: '',
        // BZID: this.data.data.pgbzID,
        PGID: this.data.data.pgid,
        minDate: this.data.data.minDate, // 最小时间限制
        maxDate: this.data.data.maxDate // 最大时间限制
      },
      vue: this,
      then(response) {
        app.$kwz.alert('保存成功')
        // 点击保存按钮时,将初始zgxsId置空,否则onUnload里的判断会真,会运行删除zgxsId函数
        // this.zgxsidOld = ""
        wx.redirectTo({ url: '/pages/xcdd/xcdd' })
      }
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
  // 后续处理意见弹出框确认
  hxclyjConfirm({detail}){
    this.data.data.status = detail.status
    this.data.data.status_mc = detail.status_mc
    this.data.data.zgxsyj = detail.zgxsyj
    this.data.data.zgxsid = detail.zgxsid
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
  // 督导纪实修改
  ddjsInput({ detail }) {
    this.data.data.ddjs = detail.data
  },
  //打开关闭 督导纪实 资料采集 经验做法 存在问题
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
  // 更改 查阅资料 列席会议 座谈作坊 问卷调查 校园寻访 值
  changeCyzl({ detail }){
    this.data.data.cyzl = detail.value
    this.setData({ data: this.data.data })
  },
  changeLxhy({ detail }) {
    this.data.data.lxhy = detail.value
    this.setData({ data: this.data.data })
  },
  changeZtzf({ detail }) {
    this.data.data.ztzf = detail.value
    this.setData({ data: this.data.data })
  },
  changeWjdc({ detail }) {
    this.data.data.wjdc = detail.value
    this.setData({ data: this.data.data })
  },
  changeXyxs({ detail }) {
    this.data.data.xyxs = detail.value
    this.setData({ data: this.data.data })
  },
  // 更改 典型经验做法 存在问题 值
  inputDxjyzf({ detail }){
    this.data.data.dxjyzf = detail.value
  },
  inputCzwt({ detail }) {
    this.data.data.czwt = detail.value
  },
})