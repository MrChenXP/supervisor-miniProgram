// pages/xcdd/xcdd-add/xcdd-add.js
Page({
  data: {
    // 工作计划选择页面显示隐藏
    gzjhShow: true
    
  },
  onLoad: function (options) {
    
  },
  // 打开工作计划
  openGzjh(){
    this.setData({ gzjhShow: true })
  }
})