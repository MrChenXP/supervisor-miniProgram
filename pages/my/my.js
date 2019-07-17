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
  loginSuccess (){
    app.$kwz.getLoginUser((user) => {
      console.log(user)
      if (user) {
        this.setData({ 
          user,
          loginShow: false
        })
      }
    }, this)
  },
  // 退出
  logout () {
    app.$kwz.logout(() => {
      this.setData({
        loginShow: true
      })
    }, this)
  },
  // 扫码
  scanCode() {
    let _this = this
    wx.scanCode({
      success: function (response) {
        let res = JSON.parse(response.result)
        _this.scanCodeAjax(res)
      },
      fail: function (e) {
        // e.errMsg === "scanCode:fail" 失败   "scanCode:fail cancel" 取消
        if (e.errMsg === "scanCode:fail") {
          app.$kwz.alert("扫码失败,请重新扫码！", 2000)
        }
      }
    });
  },
  // 扫码成功后执行的ajax
  scanCodeAjax(res) {
    let TIME = app.$kwz.formatDate("yyyy/MM/dd hh:mm:ss")
    app.$kwz.ajax.ajaxUrl({
      url: res.URL,
      type: 'POST',
      page: this,
      data: {
        CONTENT_ID: res.CONTENT_ID,
        SIGNAL: res.SIGNAL,
        TIME: TIME,
        U_ID: this.data.user.uid,
        STARTTIME: res.STARTTIME,
        ENDTIME: res.ENDTIME,
      },
      then(response) {
        let data = response.datas
        if (data.code < "1005") {
          setTimeout(function () {
            app.$kwz.alert(data.info, 2000)
          }, 500)

        } else {
          console.error(data.info)
        }
      }
    })
  }
})
