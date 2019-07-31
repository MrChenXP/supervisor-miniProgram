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
        // 提示红点显示隐藏
        redDot: {},
        // 工作区功能数据信息
        products: [],
        // 待办弹框显示隐藏
        wddbShow: false,
    },
    onShow() {
        // 判断登录
        if (app.$kwz.checkLogin()) {
            // 加载工作区 异步的
            app.$kwz.initProducts((products) => {
                if (products) {
                    this.setData({
                        products
                    })
                    this.initTips()
                }
            }, this)
        }
    },
    // 获取桌面的提示信息
    initTips() {
        app.$kwz.ajax.ajaxUrl({
            url: '/ddGztx/open/getTxData',
            data: {
                TXSET: '{"b892eba5fae9493189ac81a510bbbd73":"DDGZAP","ebc60e699bc642a1871f1e017b979483":"DDJL","3758a16aa4e14b3d87bb1f9c7e2fc509":"DDZGTZ","DDHYDDHYDDHYDDHYDDHYDDHYDDHYDDHY":"DDHY","SJDDJLSJDDJLSJDDJLSJDDJLSJDDJLa1":"SJDDJL","TKJLTKJLTKJLTKJLTKJLTKJLTKJLTKJL":"TKJL"}'
            },
            page: this,
            success(data) {
                let datas = data.datas
                if (datas) {
                    // 将返回的pro_id赋值给redDot 页面循环中根据pro_id进行判断红点显示隐藏
                    this.data.redDot = datas
                    // (我的待办)
                    let wddb = 0
                    // 整改工作
                    wddb += datas['3758a16aa4e14b3d87bb1f9c7e2fc509'] || 0
                    // 现场督导 督导记录
                    wddb += datas['ebc60e699bc642a1871f1e017b979483'] || 0
                    // 工作安排
                    wddb += datas['b892eba5fae9493189ac81a510bbbd73'] || 0
                    // 上面的看板数据
                    this.data.tips = {
                        zggz: datas['3758a16aa4e14b3d87bb1f9c7e2fc509'] || 0,
                        ddjs: datas['ebc60e699bc642a1871f1e017b979483'] || 0,
                        gzjh: datas['b892eba5fae9493189ac81a510bbbd73'] || 0,
                        wddb,
                        cxcs: datas['SJDDJLSJDDJLSJDDJLSJDDJLSJDDJLa1'] || 0,
                        tkcs: datas['TKJLTKJLTKJLTKJLTKJLTKJLTKJLTKJL'] || 0,
                        yss: datas['DDHYDDHYDDHYDDHYDDHYDDHYDDHYDDHY'] || 0
                    }
                    this.setData({
                        redDot: datas,
                        tips: this.data.tips
                    })
                }
            }
        })
    },
    // 去我的待办 现场督导 整改工作 工作计划 只有一项数据时，直接跳转
    toDb() {
        let ddjs = this.data.tips.ddjs
        let gzjh = this.data.tips.gzjh
        let zggz = this.data.tips.zggz
        if (ddjs || gzjh || zggz) {
            if (ddjs && !gzjh && !zggz) {
                this.toXcdd()
            } else if (!ddjs && gzjh && !zggz) {
                wx.navigateTo({
                    url: "/pages/gzjh/gzjh"
                })
            } else if (!ddjs && !gzjh && zggz) {
                wx.navigateTo({
                    url: "/pages/zggz/zggz"
                })
            } else {
                this.wddbShow()
            }
        }
    },
    // 我的待办弹框显示隐藏
    wddbShow() {
        this.setData({
            wddbShow: !this.data.wddbShow,
        })
    },
    // 去现场督导 工作计划 整改工作 听课记录
    toXcdd() {
        wx.navigateTo({
            url: "/pages/xcdd/xcdd"
        })
    },
    toGzjh() {
        wx.navigateTo({
            url: "/pages/gzjh/gzjh"
        })
    },
    toZggz() {
        wx.navigateTo({
            url: "/pages/zggz/zggz"
        })
    },
    toTkjl() {
        wx.navigateTo({
            url: "/pages/tkjl/tkjl"
        })
    }
})