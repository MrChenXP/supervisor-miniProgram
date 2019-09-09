//index.js

const app = getApp()

Page({
    data: {
        // 用户数据
        user: {
            IMAGE: "",
            name: "",
            ddlx: "",
            orgMc: ""
        },
        // 登录组件显示隐藏
        loginShow: false,
        //  个人资料 修改密码 切换机构(用'默认机构设置'的功能路径) 签到签退  权限
        hasGrzlAuth: false,
        hasXgmmAuth: false,
        hasQhjgAuth: false,
        hasQdqtAuth: false,
        // 头像路径
        imageUrl:""
    },
    onShow() {
        if (!app.$kwz.isLogin()) {
            this.setData({
                loginShow: true,
                user: {}
            })
        } else {
            this.initUser()
        }
    },
    // 加载用户数据
    initUser() {
        app.$kwz.getLoginUser((user) => {
            if (user) {
                this.setData({ 
                    user,
                    loginShow: false
                })
            }
        }, this)
        this.has()
        // 获取头像
        app.$kwz.ajax.ajaxUrl({
            url: 'dd_dxgl/selectByPrimaryKeyGrzl',
            type: 'POST',
            page: this,
            then(response) {
                app.$kwz.cacheAttach({
                    url: 'jc_file/doDownload?F_ID=' + response.datas.IMAGE,
                    page: this,
                    success({ tempFilePath }) {
                        this.setData({ imageUrl: tempFilePath })
                    }
                })
            }
        })
    },
    // 登陆成功
    loginSuccess() {
        this.initUser()
    },
    // 退出
    logout() {
        app.$kwz.logout(() => {
            this.setData({
                loginShow: true
            })
        }, this)
    },
    // 获取权限 dd_dxgl/toGrzl
    has(){
        app.$kwz.hasAuth('dd_dxgl/toGrzl', (auth) => {
            auth ? this.setData({ hasGrzlAuth: auth }) : ""
        })
        app.$kwz.hasAuth('jc_user/toJcUserGgmm', (auth) => {
            auth ? this.setData({ hasXgmmAuth: auth }) : ""
        })
        app.$kwz.hasAuth('dd_index/toChangeOrgRole', (auth) => {
            auth ? this.setData({ hasQhjgAuth: auth }) : ""
        })
        app.$kwz.hasAuth('jc_gps/toSavePositionRecord', (auth) => {
            auth ? this.setData({ hasQdqtAuth: auth }) : ""
        })
        
    },
    // 扫码
    scanCode() {
        let _this = this
        wx.scanCode({
            success: function(response) {
                let res = JSON.parse(response.result)
                _this.scanCodeAjax(res)
            },
            fail: function(e) {
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
                dxPxId: res.dxPxId,
                signal: res.signal,
                endTime: res.endTime,
                startTime: res.startTime,
                userId: this.data.user.uid,
                time:TIME
            },
            then(response) {
                let data = response.datas
                if (data.code < "1005") {
                    setTimeout(function() {
                        app.$kwz.alert(data.info, 2000)
                    }, 500)

                } else {
                    console.error(data.info)
                }
            }
        })
    }
})