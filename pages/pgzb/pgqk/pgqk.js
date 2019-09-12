// pages/pgzb/pgqk/pgqk.js
const app = getApp()
Page({
    data: {
        // 自评数据
        zpData: '',
        // 督评数据
        dpData:'',
        // 可以填写的观测点列表
        inputGcdList: [],
        // 用户id
        uid: {},
        // 评估id
        pgId: "",
        // 第一个pid
        onePid: '',
        // 最后一个pid
        lastPid: '',
        // 用户选择的观测点ID
        pId: '',
        // 评估类型
        type: '',
        // 给评估情况用的值
        evaluationType: '',
        evaluationOrgId: '',
        isReport: '',
        name: '',
        nbId: '',
    },
    onLoad(param) {
        this.data.pgId = param.pgId || ''
        this.data.pId = param.pId || ''
        this.setData({ type: param.type || ''})
        this.data.evaluationType = param.evaluationType || ''
        this.data.evaluationOrgId = param.evaluationOrgId || ''
        this.data.isReport = param.isReport || ''
        this.data.name = param.name || ''
        this.data.nbId = param.nbId || ''
        this.initPage()
    },
    // 初始化页面
    initPage() {
        app.$kwz.getLoginUser((user) => {
            this.data.uid = user.uid
            // 如果没有pid就要取第一个pid
            app.$kwz.ajax.ajaxUrl({
                url: 'dd/ddGpEvaluationReport/doEvaluationPage',
                type: 'POST',
                data: {
                    pgId: this.data.pgId, //评估id
                    userId: this.data.uid //用户id
                },
                page: this,
                then(response) {
                    let datas = response.datas
                    // 如果没有pid就要取第一个pid
                    if (!this.data.pId) {
                        this.data.pId = datas[0].pId
                    }
                    this.data.onePid = datas[0].pId
                    this.loadData()
                }
            })
        }, this)
    },
    // 预先加载数据
    loadData() {
        this.getPgData()
        // 加载当前指标所有可以填报的观测点信息
        app.$kwz.ajax.ajaxUrl({
            url: 'dd/ddGpEvaluationReport/findEnabledViewPoint',
            type: 'POST',
            data: {
                pId: this.data.onePid // 一定要第一个id
            },
            page: this,
            then(response) {
                this.data.inputGcdList = response.datas
                let i = response.datas.length - 1
                this.setData({
                    pId: this.data.pId,
                    onePid: this.data.onePid,
                    lastPid: this.data.inputGcdList[i].pId
                })
            }
        })
    },
    // 加载评估数据 督评(2)和自评(1)接口不一样
    getPgData(){
        if (this.data.type == "2") {
            // 督评的自评
            app.$kwz.ajax.ajaxUrl({
                url: 'dd/ddGpEvaluationReport/selfEvaluationAreaMsg',
                type: 'POST',
                data: {
                    pgId: this.data.pgId, //评估id
                    userId: this.data.uid, //用户id
                    pId: this.data.pId,
                    isReport: this.data.isReport,
                    evaluationType: this.data.evaluationType,
                    evaluationUserId: this.data.evaluationUserId,
                    evaluationOrgId: this.data.evaluationOrgId,
                    nbId: this.data.nbId,
                    type: this.data.type
                },
                page: this,
                then(response) {
                    this.setData({ zpData: response.datas })
                }
            })
            // 督评的督评
            app.$kwz.ajax.ajaxUrl({
                url: 'dd/ddGpEvaluationReport/orgEvaluationAreaMsg',
                type: 'POST',
                data: {
                    pgId: this.data.pgId, //评估id
                    userId: this.data.uid, //用户id
                    pId: this.data.pId,
                    isReport: this.data.isReport,
                    evaluationType: this.data.evaluationType,
                    evaluationUserId: this.data.evaluationUserId,
                    evaluationOrgId: this.data.evaluationOrgId,
                    nbId: this.data.nbId,
                    type: this.data.type,
                },
                page: this,
                then(response) {
                    this.setData({ dpData: response.datas })
                }
            })
        } else {
            // 自评加载督评
            app.$kwz.ajax.ajaxUrl({
                url: 'dd/ddGpEvaluationReport/orgDpEvaluationAreaMsg',
                type: 'POST',
                data: {
                    pgId: this.data.pgId, //评估id
                    pId: this.data.pId,
                    isReport: this.data.isReport,
                    evaluationType: this.data.evaluationType,
                    evaluationUserId: this.data.evaluationUserId,
                    evaluationOrgId: this.data.evaluationOrgId,
                    nbId: this.data.nbId,
                    name: this.data.name,
                    type: this.data.type,
                },
                page: this,
                then(response) {
                    this.setData({ dpData: response.datas })
                }
            })
        }
    },
    // 上一个 下一个 
    syg() {
        for (let i in this.data.inputGcdList) {
            if (this.data.inputGcdList[i].pId == this.data.pId) {
                if (i == 0) {
                    app.$kwz.alert("已是第一个！")
                } else {
                    this.data.pId = this.data.inputGcdList[i - 1].pId
                    this.setData({
                        pId: this.data.inputGcdList[i - 1].pId
                    })
                    this.getPgData()
                }
                break
            }
        }
    },
    xyg() {
        for (let i in this.data.inputGcdList) {
            if (this.data.inputGcdList[i].pId == this.data.pId) {
                if (i == this.data.inputGcdList.length - 1) {
                    app.$kwz.alert("已是最后一个！")
                } else {
                    this.data.pId = this.data.inputGcdList[parseInt(i) + 1].pId
                    this.setData({
                        pId: this.data.inputGcdList[parseInt(i) + 1].pId
                    })
                    this.getPgData()
                }
                break
            }
        }
    },
    // 去评估指标 评估情况
    toPgzb() {
        let url = `pgId=${this.data.pgId}&pId=${this.data.pId}&type=${this.data.type}&evaluationObjectType=${this.data.evaluationType}&evaluationOrgId=${this.data.evaluationOrgId}&isReport=${this.data.isReport}&name=${this.data.name}&nbId=${this.data.nbId}`
        wx.redirectTo({
            url: `/pages/pgzb/pgzb?` + url
        })
    },
    toPgtb() {
        let url = `pgId=${this.data.pgId}&pId=${this.data.pId}&type=${this.data.type}&evaluationType=${this.data.evaluationType}&evaluationOrgId=${this.data.evaluationOrgId}&isReport=${this.data.isReport}&name=${this.data.name}&nbId=${this.data.nbId}`
        wx.redirectTo({
            url: `/pages/pgzb/pgtb/pgtb?` + url
        })
    }
})