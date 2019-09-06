// pages/dxsl/dxsl.js
const app = getApp()
Page({
    data: {
        // 预览权限
        hasYlAuth: false,
        // 搜索参数
        searchCondition:{
            // 机构列表
            JGLB:[{DMMX_CODE: "", DMMX_MC: "全部"}]
        },
        // 搜索以及分页参数
        pageParam: {
            // 机构id
            ORG_MC:"全部",
            // 机构名称
            ORG_ID:"",
            // 标题 关键字
            keyword:"",
            // 作者
            AUTHOR:"",
            // 页码
            page: 1,
        },
        // 列表数据
        dataList: [],
        // 加载更多的提示信息
        loadMore: {
            text: "正在加载",
            show: true
        }
    },
    onLoad() {
        this.initData()
        this.has()
    },
    onReachBottom() {
        this.data.loadMore.show = true
        this.data.loadMore.show = "正在加载..."
        this.setData({
            loadMore: this.data.loadMore
        })
        this.pageList()
    },
    // 初始化页面
    initData(){
        app.$kwz.ajax.ajaxUrl({
            url: 'jc_content/getOrgSelect',
            type: 'POST',
            page: this,
            then(response){
                let datas = response.datas 
                if (datas && datas.length > 0) {
                    for (let i = 0; i < datas.length; i++) {
                        this.data.searchCondition.JGLB.push({
                            DMMX_MC: datas[i].ORG_MC,
                            DMMX_CODE: datas[i].ORG_ID
                        })
                    }
                }
                this.setData({searchCondition:this.data.searchCondition})
            }
        })
        this.pageList(true)
    },
    // 加载列表 type=>true（覆盖式）/false（增量式）
    pageList(type){
        if (type) {
            this.data.pageParam.page = 1
        }
        app.$kwz.ajax.ajaxUrl({
            url: 'jc_content/doCmsFbPageList/DDDXSL',
            type: 'POST',
            page: this,
            data: {
                page: this.data.pageParam.page,
                TITLE: this.data.pageParam.keyword,
                AUTHOR: this.data.pageParam.AUTHOR,
                ORG_ID: this.data.pageParam.ORG_ID
            },
            then(data) {
                let datas = data.datas
                if (datas && datas.length > 0) {
                    this.data.pageParam.page++
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
    has(){
        app.$kwz.hasAuth('jc_content/doSelectByPrimary/DDDXSL', (auth) => {
            auth ? this.setData({
                hasYlAuth: auth
            }) : ""
        })
    },
    // 修改 作者
    inputZz({detail}){
        this.data.pageParam.AUTHOR = detail.value
        this.setData({ pageParam: this.data.pageParam})
    },
    // 选择搜索条件  机构
    changeJg(e) {
        let checkedOption = this.data.searchCondition.JGLB[e.detail.value]
        this.data.pageParam.ORG_ID = checkedOption.DMMX_CODE
        this.data.pageParam.ORG_MC = checkedOption.DMMX_MC
        this.setData({
            pageParam: this.data.pageParam
        })
    },
    // 搜素列表
    searchList(e) {
        this.data.pageParam.keyword = e.detail.value
        this.pageList(true)
    },
    // 去预览
    toPreview(e) {
        if(!this.data.hasYlAuth){
            return
        }
        let id = e.currentTarget.dataset.id
        let IS_RECORD = e.currentTarget.dataset.isrecord || ""
        if (id) {
            wx.navigateTo({
                url: '/pages/dxsl/dxsl-preview/dxsl-preview?CONTENT_ID=' + id + "&IS_RECORD=" + IS_RECORD
            })
        }
    },
})