// pages/pg/pg.js
const app = getApp()
Page({
    data: {
        // 传过来的参数集
        param: {},
        // 用户数据
        user: {},
        // 头部报告数据
        tbbg: {},
        // 下面的评估数据
        xmpg: {},
        // 他评报告详情的下标和数据
        tpbgI:0,
        tpbgData:{},
        // 指标观测点点击的下标和数据
        zbgcdIdex: [0, 0],
        zbgcdData: {},
        // 自评报告 指标观测点 显示隐藏
        zpbgShow: true,
        zbgcdShow: true,
    },
    onLoad: function (param) {
        this.setData({ param })
        app.$kwz.getLoginUser((user) => {
            this.setData({ user })
        }, this)
        if (param.PID && param.MBID && param.PCID && param.XH) {
            this.init()
        }
    },
    // 初始化
    init() {
        // 获取自评报告详情
        app.$kwz.ajax.ajaxUrl({
            url: 'dd_pgmx/selectPgjgList',
            type: 'POST',
            data: {
                MB_ORG_ID: this.data.param.MB_ORG_ID,
                XH: this.data.param.XH,
                PCID: this.data.param.PCID,
                "ISDP": '1'
            },
            page: this,
            then(response) {
                this.setData({ tbbg: response.datas.list })
            }
        })
        // 获取下方评估列表及观测点数据
        app.$kwz.ajax.ajaxUrl({
            url: 'dd_pgmx/doGetDpPointTableList',
            type: 'POST',
            data: {
                MBID: this.data.param.MBID,
                PID: this.data.param.PID,
                MB_ORG_ID: this.data.param.MB_ORG_ID,
                PCID: this.data.param.PCID,
                XH: this.data.param.XH,
            },
            page: this,
            then(response) {
                this.setData({ xmpg: response.datas[0] })
            }
        })
    },
    // 保存报告详情
    saveBg() {
        app.$kwz.ajax.ajaxUrl({
            url: 'ddpg_mb/doSavePgrjg',
            type: 'POST',
            data: {
                TCLD: this.data.tpbgData.TCLD,
                CZWT: this.data.tpbgData.CZWT,
                ZPZJ: this.data.tpbgData.ZGJY,
                PGZJ: this.data.tpbgData.PGZJ,
                PGR_ID: this.data.tbbg[this.data.tpbgI].PGR_ID
            },
            page: this,
            then(response) {
                this.zpbgShow()
                app.$kwz.alert("保存成功")
            }
        })
    },
    // 保存自评观测点详情
    saveZpgcd() {
        app.$kwz.ajax.ajaxUrl({
            url: 'dd_pgmx/doDp/1',
            type: 'POST',
            data: {
                MXID_0: this.data.zbgcdData.MXID,
                PID_0: this.data.zbgcdData.PID,
                PCID: this.data.zbgcdData.PCID,
                MBID: this.data.zbgcdData.MXID,
                MB_STATUS: this.data.zbgcdData.STATUS,
                PFZ_0: this.data.zbgcdData.P_FZ,//分值
                PLEVEL_0: this.data.zbgcdData.P_LEVEL ? this.data.zbgcdData.P_LEVEL : "",//等级
                PGYJ_0: this.data.zbgcdData.PGYJ,//评估意见
                CZWT_0: this.data.zbgcdData.CZWT,//存在问题
                PGR_ID: this.data.zbgcdData.PGR_ID,//评估人id
            },
            page: this,
            then(response) {
                this.zbgcdShow()
                app.$kwz.alert("保存成功")
            }
        })
    },
    // 保存整个评估
    savePg() {
        app.$kwz.ajax.ajaxUrl({
            url: 'dd_pgmx/doDp/2',
            type: 'POST',
            data: {
                PGR_ID: this.data.param.PGR_ID,
                MBID: this.data.param.MBID,
                MB_ORG_ID: this.data.param.MB_ORG_ID,
                PCID: this.data.param.PCID,
                MB_STATUS: this.data.param.STATU,
                XH: this.data.param.XH,
            },
            page: this,
            then(response) {
                wx.navigateBack({})
                app.$kwz.alert("保存成功")
            }
        })
    },
    // 更改 报告-他评报告、突出亮点、存在问题 整改建议
    inputZpzj({ detail }) {
        this.data.tpbgData.PGZJ = detail.data
    },
    inputTcld({ detail }) {
        this.data.tpbgData.TCLD = detail.value
    },
    inputCzwt({ detail }) {
        this.data.tpbgData.CZWT = detail.value
    },
    inputXybgzjh({ detail }) {
        this.data.tpbgData.ZGJY = detail.value
    },
    // 更改 自评观测点-赋分-加减方式
    changeFfjj({ detail }) {
        this.data.zbgcdData.P_FZ = detail.value
        this.setData({
            data: this.data.zbgcdData
        })
    },
    // 更改 自评观测点-赋分-选择器方式
    changeFfxzq(e) {
        let zbgcdData = this.data.zbgcdData.exps[e.detail.value]
        this.data.zbgcdData.P_FZ = zbgcdData.xzqz
        this.setData({
            zbgcdData: this.data.zbgcdData
        })
    },
    // 更改 他评观测点-指标评价说说明 他评观测点-存在问题
    inputGcdPjsm({ detail }) {
        this.data.zbgcdData.PGYJ = detail.value
    },
    inputGcdCzwt({ detail }) {
        this.data.zbgcdData.CZWT = detail.value
    },

    // 他评报告 指标观测点 显示隐藏
    zpbgShow(e) {
        this.setData({ zpbgShow: !this.data.zpbgShow })
        if (e && e.currentTarget.dataset.index) {
            let i = e.currentTarget.dataset.index
            app.$kwz.ajax.ajaxUrl({
                url: 'ddpg_mb/doSelectPgrByPrimaryKey',
                type: 'POST',
                data: {
                    PGR_ID: this.data.tbbg[i].PGR_ID,
                },
                page: this,
                then(response) {
                    this.setData({
                        tpbgData: response.datas,
                        tpbgI: i,
                    })
                }
            })
        }
    },
    zbgcdShow(e) {
        this.setData({ zbgcdShow: !this.data.zbgcdShow })
        if (e && e.currentTarget.dataset.index) {
            let i = e.currentTarget.dataset.index
            this.setData({ zbgcdIdex: i })
            if (i.length == 3) {
                let zbgcdData = this.data.xmpg.children[i[0]].children[i[1]].PG_LIST[i[2]]
                zbgcdData.exps = []
                zbgcdData.EXPRESSION = typeof zbgcdData.EXPRESSION == 'string' ? JSON.parse(zbgcdData.EXPRESSION) : zbgcdData.EXPRESSION
                for (let zi in zbgcdData.EXPRESSION) {
                    zbgcdData.exps.push({
                        xzqmz: zi,
                        xzqz: zbgcdData.EXPRESSION[zi]
                    })
                }
                this.setData({
                    zbgcdData: zbgcdData
                })
            } else {
                let zbgcdData = this.data.xmpg.children[i[0]].children[i[1]].children[i[2]].PG_LIST[i[2]]
                zbgcdData.EXPRESSION = typeof zbgcdData.EXPRESSION == 'string' ? JSON.parse(zbgcdData.EXPRESSION) : zbgcdData.EXPRESSION
                for (let zi in zbgcdData.EXPRESSION) {
                    zbgcdData.exps.push({
                        xzqmz: zi,
                        xzqz: zbgcdData.EXPRESSION.zi
                    })
                }
                this.setData({
                    zbgcdData: zbgcdData
                })
            }
        }
    },
    //  返回上一个页面
    back() {
        wx.navigateBack({})
    },
    catchtouchmove() { }
})