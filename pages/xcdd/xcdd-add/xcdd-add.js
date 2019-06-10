// pages/xcdd/xcdd-add/xcdd-add.js
Page({
  data: {
    // 工作计划,学校,随行督学选择页面 后续处理意见 显示隐藏
    gzjhShow: false,
    schoolShow: false,
    sxdxShow: false,
    hxclyjShow: false,
    // 督导纪实 资料采集 经验做法 存在问题 显示隐藏
    ddjsShow: true,
    zlcjShow: true,
    jyzfShow: true,
    czwtShow: true,   
    // 页面数据
    data:{
      ywsj: "2016-09-01", // 业务时间
    }
  },
  onLoad: function (options) {
    
  },
  // 打开工作计划 学校 随行督学 
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
    console.log(e)
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