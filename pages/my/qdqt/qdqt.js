// pages/my/qdqt/qdqt.js
Page({
  data: {
    userOrgs: [{
      ORG_MC: '在您附近未找到学校',
      ORG_ID: ''
    }],
    // 加载的学校是否空
    userOrgsShow: false,
    // 加载更多的提示信息
    loadMore: {
      text: "上拉加载更多",
      show: false
    },
    // 当前的签到记录
    currentRecord: {
      ORG_ID: ''
    },
    // 显示签到页面还是显示签出页面
    currentRecordShow: true,
    // 历史记录
    currentRecords: []
  },
  onLoad: function (options) {
    this.init()
  },
  onReachBottom() {
    this.data.loadMore.show = true
    this.data.loadMore.show = "正在加载..."
    this.setData({ loadMore: this.data.loadMore })
    this.initPage()
  },
  // 
  init() {
    // 加载当前签到状态
    this.initPosition()
    // 加载历史记录
    this.loadPistionRecords()
  },
  // 初始化页面 flag =>true/false 初始化/增加
  initPage(flag) {},
  initPosition() {},
  loadPistionRecords() {
    this.initPage(true)
  },
  // 签到/签出
  checkPosition() {},
  changePostionOrg(org) {
    this.data.currentRecord.ORG_ID = org
    this.setData({ currentRecord: this.data.currentRecord})
  },
  loadPosition(callback) {}
})