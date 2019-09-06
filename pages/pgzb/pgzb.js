const app = getApp()
Page({
    data: {
        // 观测点列表
        gcdList: [],
        // 用户id
        uid: {},
        // 评估id
        pgId: "",
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
        this.data.evaluationType = param.evaluationType || ''
        this.data.evaluationOrgId = param.evaluationOrgId || ''
        this.data.isReport = param.isReport || ''
        this.data.name = param.name || ''
        this.data.nbId = param.nbId || ''
        this.setData({ 
            type: param.type || '',
            evaluationType: param.type || '',
            evaluationOrgId: param.evaluationOrgId || '',
            isReport: param.isReport || '',
            name: param.name || '',
            nbId: param.nbId || '',
        })
        this.initPage()
    },
    // 初始化页面
    initPage(){
        app.$kwz.getLoginUser((user) => {
            this.data.uid = user.uid
            this.loadData()
        }, this)
    },
    // 预先加载数据
    loadData() {
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
                this.setData({
                    gcdList: datas,
                    pgId: this.data.pgId
                })
            }
        })
    },
    // 去评估填报 评估情况
    toPgtb(){
        let url = `pgId=${this.data.pgId}&pId=${this.data.pId}&type=${this.data.type}&evaluationType=${this.data.evaluationType}&evaluationOrgId=${this.data.evaluationOrgId}&isReport=${this.data.isReport}&name=${this.data.name}&nbId=${this.data.nbId}`
        wx.navigateTo({
            url: `/pages/pgzb/pgtb/pgtb?` + url
        })
    },
    toPgqk(){
        let url = `pgId=${this.data.pgId}&pId=${this.data.pId}&type=${this.data.type}&evaluationType=${this.data.evaluationType}&evaluationOrgId=${this.data.evaluationOrgId}&isReport=${this.data.isReport}&name=${this.data.name}&nbId=${this.data.nbId}`
        wx.navigateTo({
            url: `/pages/pgzb/pgqk/pgqk?` + url
        })
    }
})