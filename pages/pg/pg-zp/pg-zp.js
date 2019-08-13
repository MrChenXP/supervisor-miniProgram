// pages/pg/pg.js
const app = getApp()
Page({
    data: {
        // 传过来的参数集
        param:{},
        // 用户数据
        user:{},
        // 头部报告数据
        tbbg:{},
        // 下面的评估数据
        xmpg:{},
        // 指标观测点点击的下标和数据
        zbgcdIdex:[0,0],
        zbgcdData:{},
        // 自评报告 指标观测点 显示隐藏
        zpbgShow: true,
        zbgcdShow: true,
    },
    onLoad: function (param) {
        this.setData({param})
        app.$kwz.getLoginUser((user) => {
            this.setData({ user })
        }, this)
        if(param.PID){
            this.init()
        }
    },
    // 初始化
    init(){
        // 获取自评报告详情
        app.$kwz.ajax.ajaxUrl({
            url: 'dd_pgmx/selectPgjgList',
            type: 'POST',
            data: {
                MBID: this.data.param.MBID,
                XH: "1"
            },
            page: this,
            then(response) {
                this.setData({ tbbg: response.datas.list[0]})
            }
        })

        // 获取下方评估列表及观测点数据
        app.$kwz.ajax.ajaxUrl({
            url: 'dd_pgmx/doGetPointTableList/' + this.data.param.YWLX,
            type: 'POST',
            data: {
                MBID: this.data.param.MBID,
                PID: this.data.param.PID
            },
            page: this,
            then(response) {
                this.setData({ xmpg: response.datas[0] })
            }
        })
    },
    // 保存报告详情
    saveBg(){
        app.$kwz.ajax.ajaxUrl({
            url: 'ddpg_mb/doSavePgjg/' + this.data.param.YWLX,
            type: 'POST',
            data: {
                TCLD: this.data.tbbg.ZP_TCLD,
                CZWT: this.data.tbbg.ZP_CZWT,
                XYBGZ: this.data.tbbg.ZP_XYBGZ,
                ZPZJ: this.data.tbbg.ZP_ZPZJ,
                MBID: this.data.param.MBID
            },
            page: this,
            then(response) {
                this.zpbgShow()
                app.$kwz.alert("保存成功")
                // this.setData({tbbg: this.data.tbbg}) 先不同步到原始页
            }
        })
    },
    // 保存自评观测点详情
    saveZpgcd(){
        app.$kwz.ajax.ajaxUrl({
            url: 'dd_pgmx/doSave/1',
            type: 'POST',
            data: {
                MXID_0: this.data.zbgcdData.MXID,
                PID_0: this.data.zbgcdData.PID,
                PCID: this.data.zbgcdData.PCID,
                MBID: this.data.zbgcdData.MXID,
                STATUS: this.data.zbgcdData.STATUS,
                FZ_0: this.data.zbgcdData.P_FZ,//分值
                LEVEL_0: this.data.zbgcdData.P_LEVEL ? this.data.zbgcdData.P_LEVEL : "",//等级
                ZPYJ_0: this.data.zbgcdData.PGYJ,//评估意见
                CZWT_0: this.data.zbgcdData.CZWT,//存在问题
                DLSJ_0: ''//数据详情 后端也不知道要不要先防空
            },
            page: this,
            then(response) {
                this.zbgcdShow()
                app.$kwz.alert("保存成功")
            }
        })
    },
    // 保存整个评估
    saveBg() {
        app.$kwz.ajax.ajaxUrl({
            url: 'dd_pgmx/doSave/2',
            type: 'POST',
            data: {
                PCID: this.data.param.PCID,
                MBID: this.data.param.MBID,
                MB_STATUS: this.data.param.STATU
            },
            page: this,
            then(response) {
                wx.navigateBack({})
                app.$kwz.alert("保存成功")
            }
        })
    },
    // 更改 报告-自评报告 报告-突出亮点  报告-存在问题 报告-下一步工作计划
    inputZpzj({ detail}){
        this.data.tbbg.ZP_ZPZJ = detail.data
    },
    inputTcld({ detail }){
        this.data.tbbg.ZP_TCLD = detail.value
    },
    inputCzwt({ detail }){
        this.data.tbbg.ZP_CZWT = detail.value
    },
    inputXybgzjh({ detail }){
        this.data.tbbg.ZP_XYBGZ = detail.value
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
    // 更改 自评观测点-指标评价说说明 自评观测点-存在问题
    inputGcdPjsm({ detail }) {
        this.data.zbgcdData.PGYJ = detail.value
    },
    inputGcdCzwt({ detail }) {
        this.data.zbgcdData.CZWT = detail.value
    },

    // 自评报告 指标观测点 显示隐藏
    zpbgShow(){
        this.setData({ zpbgShow: !this.data.zpbgShow})
    },
    zbgcdShow(e){
        this.setData({ zbgcdShow: !this.data.zbgcdShow})
        if (e && e.currentTarget.dataset.index){
            let i = e.currentTarget.dataset.index
            this.setData({zbgcdIdex: i})
            if(i.length==2){
                let zbgcdData = this.data.xmpg.children[i[0]].children[i[1]]
                zbgcdData.exps = []
                zbgcdData.EXPRESSION = typeof zbgcdData.EXPRESSION =='string' ? JSON.parse(zbgcdData.EXPRESSION) : zbgcdData.EXPRESSION
                for (let zi in zbgcdData.EXPRESSION){
                    zbgcdData.exps.push({
                        xzqmz: zi,
                        xzqz: zbgcdData.EXPRESSION[zi]
                    })
                }
                this.setData({
                    zbgcdData: zbgcdData
                })
            } else{
                let zbgcdData = this.data.xmpg.children[i[0]].children[i[1]].children[i[2]]
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
    back(){
        wx.navigateBack({})
    },
    catchtouchmove(){}
})