const app = getApp()
Page({
  data: {
    oldPassword: '',
    newPassword:"",
    qrPassword:"",
    msg: ''
  },
  onLoad: function (options) {
    this.initMsg()
  },
  // 初始化
  initMsg () {
  	app.$kwz.ajax.ajaxUrl({
  		url: 'jc_user/doCheckPassword',
  		page: this,
  		success (data) {
  			if(data && data.datas && data.datas.msg) {
          this.setData({msg: data.datas.msg})
  			}
  		}
  	})
  },
  // 确认
  savePassword(){
    if(!this.data.oldPassword) {
  		app.$kwz.alert('旧密码不能为空')
  		return false
  	}
  	if(!this.data.newPassword) {
  		app.$kwz.alert('新密码不能为空')
  		return false
  	}
  	if(this.data.newPassword != this.data.qrPassword) {
  		app.$kwz.alert('两次输入密码不一致')
  		return false
  	}
  	
  	let data = {
  		U_PWD: this.data.oldPassword,
  		U_PWD_NEW1: this.data.newPassword,
  		U_PWD_NEW2: this.data.qrPassword
  	}
  	app.$kwz.ajax.ajaxUrl({
  		url: 'jc_user/doJcUserGgmm',
  		data,
  		page: this,
  		success (data) {
        app.$kwz.alert(data.msg)
        wx.switchTab({ url: '/pages/my/my' })
  		}
  	})
  },
  // 修改 密码 新密码 重新输入新密码
  changeOld({detail }){
    this.setData({ oldPassword: detail.value})
  },
  changeNew({detail }){
    this.setData({ newPassword: detail.value})
  },
  changeNewr({detail }){
    this.setData({ qrPassword: detail.value})
  },
})