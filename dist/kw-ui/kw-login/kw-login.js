const app = getApp()

Component({
  externalClasses: ['kw-class'],
  data: {
    // 登录头部标题
    title: '教育创新教育云平台',
    // 登录账号
    userName: 'zhoux',
    // 登录密码 
    passWord: '1234qwer',
    // 验证码输入框的值
    vcode: '',
    // 验证码图片地址
    vcodeUrl: '/static/images/loginBG.png',
    // 验证码显示隐藏
    vcodeShow: false,
    // 登录按钮-是否在请求
    loadingLogin: false
  },
  properties: {
  },
  ready() {
    // this.toggerVcode()
  },
  methods:{
    // 点击关闭按钮
    // close() {
    //   if (this.data.loadingLogin) {
        // this.$kwz.logout(false)
      // }
      // this.triggerEvent('closeLogin');
    // },
    // 切换验证码图片
    toggerVcode() {
      const vcodeUrl = '/jc_yzm/open/getYzm?yzm=' + Math.random();
      app.$kwz.cacheAttach({
        url: vcodeUrl,
        page: this,
        success (res) {
          if (res.statusCode === 200) {
            this.setData({
              vcodeUrl: res.tempFilePath,
              vcodeShow: true
            })
          }
        },
        fail () {
          app.alert('加载验证码失败')
        }
      })
      // vcodeUrl += this.$kwz.token ? ('&token=' + this.$kwz.token) : ''
      // this.$kwz.ajax.loadSource(vcodeUrl, (imgUrl) => {
      //   this.vcodeUrl = imgUrl
      // }, this)
      // this.triggerEvent('toggerVcode')
    },
    setLoadingLogin (loadingLogin) {
      this.setData({loadingLogin})
    },
    // 登陆
    login() {
      this.setLoadingLogin(true)
      if (!this.data.userName || !this.data.userName.trim()) {
        app.$kwz.alert('用户名不能为空')
        this.setLoadingLogin(false)
        return 
      }
      if (!this.data.passWord) {
        app.$kwz.alert('密码不能为空')
        this.setLoadingLogin(false)
        return 
      }
      let param = {
        login_username: this.data.userName,
        login_pwd: this.data.passWord,
        login_yzm: this.data.vcode
      }
      app.$kwz.ajax.ajaxUrl({
        url: '/login/open/doLogin',
        page: this,
        data: {
          params: JSON.stringify(param)
        },
        success (data, option, response) {
          // 存储新的sessionid
          app.$kwz.setSession(response)
          if (data && data.statusCode === '200') {
            // 登陆成功后要重新取回新的token
            app.$kwz.initToken(() => {
              // 初始化自动登陆的数据
              app.$kwz.initAutoLogin(() => {
                // 执行组件的LoginSuccess
                this.triggerEvent('LoginSuccess')
              }, this)
            }, this)
          }
        },
        fail (error) {
          let msg = '登陆失败'
          if (error && error.data) {
            if (error.data.statusCode === '500') {
              this.toggerVcode()
            }
            msg = error.data.msg || msg
          }
          app.$kwz.alert(msg)
          this.setLoadingLogin(false)
        }
      })
    },
    blurUserName (e) {
      this.setData({
        userName: e.detail.value
      })
    },
    blurPassword (e) {
      this.setData({
        passWord: e.detail.value
      })
    },
    blurVcode (e) {
      this.setData({
        vcode: e.detail.value
      })
    }
  }
});
