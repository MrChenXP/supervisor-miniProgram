const app = getApp()
Page({
    data: {
        // 搜索以及分页参数
        pageParam: {
            // 页码
            page: 1,
            // 关键字
            keyword: ''
        },
        dataList: [],
        // 加载更多的提示信息
        loadMore: {
            text: "正在加载",
            show: true,
            isMax: false // 是否到了最后一页
        },
        // 登录用户数据
        loginUser: {},
    },
    onLoad: function (options) {
        app.$kwz.getLoginUser((e) => {
            this.data.loginUser = e
        })
        this.initData()
    },
    onReachBottom: function () {
        // 因新督导这个应用 如果page传的大于最大页数，会返回第一页数据
        // 所以不能让page到了最大页数的时候运行pageList
        if(!this.data.loadMore.isMax){
            this.data.loadMore.show = true
            this.data.loadMore.show = "正在加载..."
            this.setData({
                loadMore: this.data.loadMore
            })
            this.pageList()
        }
    },
    // 初始化页面
    initData() {
        this.pageList(true)
    },
    // 加载列表 type=>true（覆盖式）/false（增量式）
    pageList(type) {
        if (type) {
            this.data.pageParam.page = 1
        }
        app.$kwz.ajax.ajaxUrl({
            url: 'dd/ddGpSelfEvaluation/doPageList',
            type: 'POST',
            page: this,
            data: {
                page: this.data.pageParam.page,
                evaluationObjectType: '1',
                name: this.data.pageParam.keyword,
                page: this.data.pageParam.page
            },
            then(response) {
                let datas = response.datas
                for (let i = 0; i < datas.length; i++) {
                    let tmp = datas[i]
                    switch(tmp.dataSource){
                        case '0': tmp.dataSource = '批次管理';break;
                        case '1': tmp.dataSource = '工作安排';break;
                        case '2': tmp.dataSource = '工作计划';break;
                        default: tmp.dataSource = '';break;
                    }
                    switch(tmp.isReport){
                        case '0': tmp.isReportName = '已上报';break;
                        case '1': tmp.isReportName = '未上报';break;
                        default: tmp.isReportName = '';break;
                    }
                    switch(tmp.calculationState){
                        case '-1': tmp.calculationState = '计算失败';break;
                        case '0': tmp.calculationState = '未开始计算';break;
                        case '1': tmp.calculationState = '计算中';break;
                        case '2': tmp.calculationState = '计算成功';break;
                        default: tmp.calculationState = '';break;
                    }
                }
                let deleteParam = {}
                if (datas && datas.length > 0) {
                    this.data.deleteParam = deleteParam
                    if(response.params.pageCount == this.data.pageParam.page){
                        this.data.loadMore.isMax = true
                    }else{
                        this.data.pageParam.page++
                    }
                    if (type) {
                        this.data.dataList = datas
                        if (datas.length < 20) {
                            this.data.loadMore.show = false
                            this.data.loadMore.text = "没有更多数据了"
                        }
                    } else {
                        this.data.dataList.push(...datas)
                        this.data.loadMore.show = false
                        this.data.loadMore.text = "上拉显示更多"
                    }
                } else {
                    this.data.loadMore.show = false
                    this.data.loadMore.text = "没有更多数据了"
                    if (type) {
                        this.data.dataList = []
                    }
                }
                this.setData({
                    dataList: this.data.dataList,
                    loadMore: this.data.loadMore,
                })
            }
        })
    },
    // 搜素列表
    searchList(e) {
        this.data.pageParam.keyword = e.detail.value
        this.pageList(true)
    },
    // 去评估指标
    toPgzb(e){
        let item = e.currentTarget.dataset.item
        // app.$kwz.ajax.ajaxUrl({
        //     url: 'dd/ddGpEvaluationReport/toEvaluationPage',
        //     type: 'POST',
        //     data: {
        //         userId: this.data.loginUser.uid,
        //         evaluationObjectType: "1",//被评估对象类型，默认1（机构），写死
        //         nbId: item.nbId, // 批次id
        //         pgId: item.pgId, // 批次id
        //         type: item.type,//评估类型
        //         isReport: item.isReport,//是否上报
        //         pId: item.pId,//指标ID
        //         evaluationOrgId: item.evaluationOrgId, // 被评估机构ID
        //     },
        //     page: this,
        //     then(response) {
                // let data = response.datas[0]
        let url = `pgId=${item.pgId}&type=${item.type}&nbId=${item.nbId}&evaluationType=${item.evaluationObjectType}&evaluationOrgId=${item.evaluationOrgId}&name=${item.name}`
                wx.navigateTo({
                    url: '/pages/pgzb/pgtb/pgtb?' + url
                })
            // }
        // })
    },
    // 撤销上报
    cxsb(e){
        let pgid = e.currentTarget.dataset.pgid
        app.$kwz.ajax.ajaxUrl({
            url: 'dd/ddGpEvaluationReport/doCancel',
            type: 'POST',
            data: {
                userId: this.data.loginUser.uid,
                pgId: pgid, // 批次id
            },
            page: this,
            then(response) {
                app.$kwz.alert(response.msg)
                this.pageList(true)
            }
        })
    }
})