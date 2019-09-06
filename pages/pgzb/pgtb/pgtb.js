const app = getApp()
Page({
    data: {
        // 当前填报观测点数据
        gcdData: [],
        // 当前指标的观测点列表
        gcdList: [],
        // 可以填写的观测点列表
        inputGcdList:[],
        // 用户id
        uid: {},
        // 评估id
        pgId: "",
        // 用户选择的观测点ID
        pId: '',
        // 第一个pid
        onePid: '',
        // 最后一个pid
        lastPid:'',
        // 评估类型
        type: '',
        // 评分类型
        pfType: '',
        // 给评估情况用的值
        evaluationType: '',
        evaluationOrgId: '',
        isReport: '',
        name: '',
        nbId: '',
        // 评分列表 值 是选择器的话
        pfValue:{
            name: '',
            value:'',
            index:''
        },
        pfList: [{ DMMX_CODE: "", DMMX_MC: "请选择" },{ DMMX_CODE: "0", DMMX_MC: "不通过" }, { DMMX_CODE: "1", DMMX_MC: "通过" }],
        // 采集项的值
        cjxValues:[]
    },
    onLoad(param) {
        this.data.pgId = param.pgId || ''
        this.data.pId = param.pId || ''
        this.data.type = param.type || ''
        this.data.evaluationType = param.evaluationType || ''
        this.data.evaluationOrgId = param.evaluationOrgId || ''
        this.data.isReport = param.isReport || ''
        this.data.name = param.name || ''
        this.data.nbId = param.nbId || ''
        this.setData({isReport: this.data.isReport})
        this.initPage()
    },
    // 初始化页面
    initPage() {
        app.$kwz.getLoginUser((user) => {
            this.data.uid = user.uid
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
    // 预先加载数据 (当前观测点数据,加载所有可的观测点)
    loadData() {
        this.getDqcd()
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
                    onePid: this.data.onePid,
                    lastPid: this.data.inputGcdList[i].pId
                })
            }
        })
    },
    // 当前观测点数据
    getDqcd(){
        app.$kwz.ajax.ajaxUrl({
            url: 'dd/ddGpEvaluationReport/viewPointEvaluationResult',
            type: 'POST',
            data: {
                pgId: this.data.pgId, //评估id
                userId: this.data.uid, //用户id
                pId: this.data.pId
            },
            page: this,
            then(response) {
                console.log(response.datas.type)
                this.setData({ gcdData: response.datas })
                this.getPflx()
                this.data.cjxValues = this.data.gcdData.collectValueVos
                this.setData({pId: response.datas.pid})
            }
        })
    },
    // 获取评分类型和值
    getPflx(){
        app.$kwz.ajax.ajaxUrl({
            url: 'dd/ddgp_quota_system/getType',
            type: 'POST',
            data: {
                pId: this.data.pId
            },
            page: this,
            then(response) {
                this.setData({ pfType: response.datas.type})
                if(this.data.pfType == 1){
                    app.$kwz.ajax.ajaxUrl({
                        url: 'dd/ddGpEvaluationReport/msgSelected',
                        type: 'POST',
                        data: {
                            pId: this.data.pId,
                            pgId: this.data.pgId
                        },
                        page: this,
                        then(response) {
                            let resultLevel = response.datas.resultLevel
                            if (resultLevel == 0){
                                this.data.pfValue.name = '不通过'
                                this.data.pfValue.index = 0
                                this.data.pfValue.value = 0
                            } else if (resultLevel == 1){
                                this.data.pfValue.name = '通过'
                                this.data.pfValue.index = 1
                                this.data.pfValue.value = 1
                            } else{
                                this.data.pfValue.name = '请选择'
                                this.data.pfValue.index = ''
                                this.data.pfValue.value = ''
                            }
                            this.setData({ pfValue: this.data.pfValue})
                        }
                    })
                }
            }
        })
    },
    // 上一个 下一个  保存上下一个
    syg(){
        for(let i in this.data.inputGcdList){
            if (this.data.inputGcdList[i].pId == this.data.pId){
                if(i==0){
                    app.$kwz.alert("已是第一个！")
                } else{
                    this.data.pId = this.data.inputGcdList[i-1].pId
                    this.getDqcd()
                }
                break
            }
        }
    },
    xyg() {
        for (let i in this.data.inputGcdList) {
            if (this.data.inputGcdList[i].pId == this.data.pId) {
                if (i == this.data.inputGcdList.length-1) {
                    app.$kwz.alert("已是最后一个！")
                } else {
                    this.data.pId = this.data.inputGcdList[parseInt(i)+1].pId
                    this.getDqcd()
                }
                break
            }
        }
    },
    save(e) {
        let data={}
        data.pgId= this.data.pgId
        data.pId = this.data.pId
        data.assessorId= this.data.uid,
        data.highlight= this.data.gcdData.highlight || ""
        data.problem = this.data.gcdData.problem || ""
        data.report = this.data.gcdData.report || ""
        data.fraction = this.data.gcdData.fraction || ""
        data.resultLevel = this.data.pfValue.value || ""
        data.type= this.data.type
        for(let i in this.data.cjxValues){
            data['collectBars[' + i +'].cId'] = this.data.cjxValues[i].cId
            data['collectBars[' + i + '].content'] = this.data.cjxValues[i].content
        }
        app.$kwz.ajax.ajaxUrl({
            url: 'dd/ddGpEvaluationReport/saveNext',
            type: 'POST',
            data,
            page: this,
            then(response) {
                app.$kwz.alert('已保存成功')
                let type = e.currentTarget.dataset.type
                type == 'up' ? this.syg() : this.xyg()
            }
        })
    },
    // 上报
    sb(){
        app.$kwz.ajax.ajaxUrl({
            url: 'dd/ddGpEvaluationReport/doReport',
            type: 'POST',
            data:{
                pgId: this.data.pgId, //评估id
                assessorId: this.data.uid, //用户id
            },
            page: this,
            then(response) {
                if (response.statusCode == '200') {
                    app.$kwz.alert("操作成功");
                    this.setData({isReport: '1'})
                } else if (response.statusCode == '300') {
                    app.$kwz.alert("操作失败");
                } else if (response.statusCode == "315") {
                    app.$kwz.alert("请填写完全部的观测点信息")
                }
            }
        })
    },
    // 撤销上报
    cxsb(){
        app.$kwz.ajax.ajaxUrl({
            url: 'dd/ddGpEvaluationReport/doCancel',
            type: 'POST',
            data: {
                pgId: this.data.pgId, //评估id
                userId: this.data.uid, //用户id
            },
            page: this,
            then(response) {
                app.$kwz.alert(response.msg)
                this.setData({ isReport: '0'})                
            }
        })
    },
    // 去评估指标 评估情况
    toPgzb() {
        let url = `pgId=${this.data.pgId}&pId=${this.data.pId}&type=${this.data.type}&evaluationType=${this.data.evaluationType}&evaluationOrgId=${this.data.evaluationOrgId}&isReport=${this.data.isReport}&name=${this.data.name}&nbId=${this.data.nbId}`
        wx.navigateTo({
            url: `/pages/pgzb/pgzb?` + url
        })
    },
    toPgqk() {
        let url = `pgId=${this.data.pgId}&pId=${this.data.pId}&type=${this.data.type}&evaluationType=${this.data.evaluationType}&evaluationOrgId=${this.data.evaluationOrgId}&isReport=${this.data.isReport}&name=${this.data.name}&nbId=${this.data.nbId}`
        wx.navigateTo({
            url: `/pages/pgzb/pgqk/pgqk?` + url
        })
    },
    // 修改 特点亮点 问题不足 建议反馈 评分
    inputTdld({ detail }) {
        this.data.gcdData.highlight = detail.value
    },
    inputWtbz({ detail }) {
        this.data.gcdData.problem = detail.value
    },
    inputJyfk({ detail }) {
        this.data.gcdData.report = detail.value
    },
    inputPf({ detail }) {
        this.data.gcdData.fraction = detail.value
    },
    // 修改 采集点
    inputCjd(e){
        let val = e.detail.value // 值
        let i = e.currentTarget.dataset.i // collectBarVos下标
        this.data.cjxValues[i].content = val
    },
    // 更改定性评价
    changeDxpj(e) {
        let checkedOption = this.data.pfList[e.detail.value]
        this.data.pfValue.value = checkedOption.DMMX_CODE
        this.data.pfValue.name = checkedOption.DMMX_MC
        this.data.pfValue.index = e.detail.value
        this.setData({
            pfValue: this.data.pfValue
        })
    },
})