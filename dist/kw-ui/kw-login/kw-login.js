Component({
  externalClasses: ['kw-class'],
  data: {
    // 登录头部标题
    title: '教育创新教育云平台',
    // 登录账号
    userName: '',
    // 登录密码 
    passWord: '',
    // 验证码输入框的值
    vcode: '',
    // 验证码图片地址
    vcodeUrl: '/static/images/loginBG.png',
    // 验证码显示隐藏
    vcodeShow: false,
    // 关闭动画的显示隐藏,
    aniShow: 'false',
    // 登录按钮-是否在请求
    loadingLogin: false
  },
  properties: {
    
  },
  ready() {
    // console.log(this.data.type)
  },
  methods:{
    // 点击关闭按钮
    close() {
      if (this.data.loadingLogin) {
        // this.$kwz.logout(false)
      }
      this.triggerEvent('closeLogin');
    },
    // 切换验证码图片
    toggerVcode() {
      // let vcodeUrl = 'jc_yzm/open/getYzm?yzm=' + Math.random();
      // vcodeUrl += this.$kwz.token ? ('&token=' + this.$kwz.token) : ''
      // this.$kwz.ajax.loadSource(vcodeUrl, (imgUrl) => {
      //   this.vcodeUrl = imgUrl
      // }, this)
      this.triggerEvent('toggerVcode')
    },
    // 切换验证码图片
    login() {
      // let vcodeUrl = 'jc_yzm/open/getYzm?yzm=' + Math.random();
      // vcodeUrl += this.$kwz.token ? ('&token=' + this.$kwz.token) : ''
      // this.$kwz.ajax.loadSource(vcodeUrl, (imgUrl) => {
      //   this.vcodeUrl = imgUrl
      // }, this)
      this.triggerEvent('loginSuccess')
    },
  }
});
