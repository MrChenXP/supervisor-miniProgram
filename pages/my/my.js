//index.js

const app = getApp()

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
    loginShow: false,
  },
  onShow () {
    if(!app.$kwz.isLogin()) {
      this.setData({
        loginShow: true
      })
    } else {
      app.$kwz.getLoginUser((user) => {
        if (user) {
          this.setData({user})
        }
      }, this)
    }
  },
  // 登陆成功
  loginSuccess ()   {
    this.setData({
      loginShow: false
    })
  },
  logout () {
    app.$kwz.logout(() => {
      this.setData({
        loginShow: true
      })
    }, this)
  }
})
