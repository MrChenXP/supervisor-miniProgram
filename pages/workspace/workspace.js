//index.js

const app = getApp()

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
    products: []
  },
  onShow () {
    if(app.$kwz.checkLogin()) {
      app.$kwz.initProducts((products) => {
        if (commonMenus) {
          this.setData({products})
        }
      }, this)
    }
  }
})
