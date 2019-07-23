// pages/zzjgt/zzjgt.js
const app = getApp()
Page({
    data: {
        // 页面数据
        data: [],
        // 查看督学显示隐藏
        ckdxShow: false,
        // 查看督学/学校数据
        dxxxData: {}
    },
    onReady: function() {
        this.initData()
    },
    // 初始化数据
    initData() {
        app.$kwz.ajax.ajaxUrl({
            url: '/dd_zrqgl/open/doPageListZzjgt',
            type: 'POST',
            page: this,
            success(data) {
                this.setData({
                    data: data.datas
                })
            }
        })
    },
    // 查看督学/学校 关闭打开
    oneCkdx({target}) {
        this.setData({
            ckdxShow: !this.data.ckdxShow,
        })
        if (target.dataset.list) {
            this.setData({
                dxxxData: target.dataset.list
            })
        }
    },
})