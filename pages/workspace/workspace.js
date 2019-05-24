//index.js

Page({
  data: {
    // 统计数据 上面的看板数据
    tips: {
      wddb: 0, // 我的代办
      cxcs: 0, // 出行次数
      tkcs: 0, // 听课次数
      yss: 0 // 验收数
    },
    // 登录组件显示隐藏
    loginShow: false,
  },
  // 关闭登录
  closeLogin(){
    this.setData({
      loginShow: false
    })
    // if (!this.$kwz.isLogin()) {
      // wx.reLaunch({
      //   url: '/pages/index/index'
      // })
    // }
  }

})
