const app = getApp()
Page({
  data: {
    userOrgs: [
      {label: '暂无机构', value: ''}
    ],
    userOrg: '',
    userOrgName: '',
    user: {}
  },
  onLoad() {
    app.$kwz.getLoginUser((user) => {
      if (user) {
        this.setData({user})
        this.loadUserOrgs(user)
      }
    }, this)
  },
  // 加载机构
  loadUserOrgs(user){
    if (user && user.orgs && user.orgs.length > 0) {
    	let loginOrgs = user.orgs
    	for (let i = 0; i < loginOrgs.length; i++) {
    		loginOrgs[i].label = loginOrgs[i].ORG_MC
    		loginOrgs[i].value = loginOrgs[i].ORG_ID
    	}
      this.setData({
        userOrgs: loginOrgs,
        userOrg: user.orgid
      })
    }
  },
  // 修改选项
  radioChange({detail}){
    this.data.userOrg = detail.value
    if (this.data.userOrg) {
    	app.$kwz.ajax.ajaxUrl({
    		url: 'index/resetOrgRole',
    		data: {
    			'ORG_ID': this.data.userOrg
    		},
    		page: this,
    		success (data) {
    			if(this.data.userOrgs && this.data.userOrgs.length > 0) {
    				for (let i = 0; i < this.data.userOrgs.length; i++) {
    					if(this.data.userOrgs[i].ORG_ID == this.data.userOrg) {
    						this.data.userOrgName = this.data.userOrgs[i].ORG_MC
    					}
    				}
    			}
    			this.data.user.orgid = this.data.userOrg
    			this.data.user.orgMc = this.data.userOrgName
    			app.$kwz.setLoginUser(this.data.user)
    			app.$kwz.initProducts(()=>{
    				wx.switchTab({ url: '/pages/my/my' })
    			}, this);
    		}
    	})
    }
  }

})