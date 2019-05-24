//index.js

Page({
  data: {
    // 用户数据
    user: {
      IMAGE:"",
      name:"督导督学",
      ddlx:"责任区督学",
      orgMc:"白云区"
    },
    // 登录组件显示隐藏
    loginShow: true,
  },
  // 关闭登录
  closeLogin() {
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
