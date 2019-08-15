const app = getApp()
Page({
    data: {
        // 删除显示隐藏
        deleteShow: true,
        // 搜索以及分页参数
        pageParam: {
            "XXBBM": "", //办学模式码
            "XXDJ": "", //学校等级码
            "XXBXLXM": "", //办学类型码
            "XXZDCXLXDM": "", //城乡类型码
            "XXBBMMC": "", //办学模式名称
            "XXDJMC": "", //学校等级码名称
            "XXBXLXMMC": "", //办学类型码名称
            "XXZDCXLXDMMC": "", //城乡类型码名称
            // 学校代码
            ORG_DM: '',
            // 分页
            page: 1,
            // 关键字 学校名字
            keyword: ''
        },
        // 搜索列表选择数据
        searchCondition: {
            // 办学类型选择列表
            DM_BXLX: [],
            // 办学模式选择列表
            DM_BXMS: [],
            // 城乡类型选择列表
            DM_XXZDCXLX: [],
            // 学校等级选择列表
            DM_XXDJ: [],
        },
        dataList: [],
        // 加载更多的提示信息
        loadMore: {
            text: "正在加载",
            show: true
        }
    },
    onLoad: function(options) {
        this.initData()
    },
    onReachBottom: function() {
        this.data.loadMore.show = true
        this.data.loadMore.show = "正在加载..."
        this.setData({
            loadMore: this.data.loadMore
        })
        this.pageList()
    },
    // 初始化页面
    initData() {
        // 从代码表中搜索列表数据
        app.$kwz.loadDms("DM_XXDJ,DM_BXMS,DM_BXLX,DM_XXZDCXLX", dms => {
            this.data.searchCondition = app.$kwz.copyJson(dms) || []
            // 给选项加“全部”。其实就是显示全部，实际为空值，后台判断空为全部
            this.data.searchCondition.DM_BXLX.unshift({
                DMMX_CODE: "",
                DMMX_MC: "全部"
            })
            this.data.searchCondition.DM_BXMS.unshift({
                DMMX_CODE: "",
                DMMX_MC: "全部"
            })
            this.data.searchCondition.DM_XXZDCXLX.unshift({
                DMMX_CODE: "",
                DMMX_MC: "全部"
            })
            this.data.searchCondition.DM_XXDJ.unshift({
                DMMX_CODE: "",
                DMMX_MC: "全部"
            })
            this.setData({
                searchCondition: this.data.searchCondition
            })
        })
        this.pageList(true)
    },
    // 加载列表 type=>true（覆盖式）/false（增量式）
    pageList(type) {
        if (type) {
            this.data.pageParam.page = 1
        }
        app.$kwz.ajax.ajaxUrl({
            url: '/dd_xx/doPageList',
            type: 'POST',
            page: this,
            data: {
                "ORG_MC": this.data.pageParam.keyword, //学校名称
                // "start":"0",
                "XXBBM": this.data.pageParam.XXBBM, //办学模式
                // "rows":"20",
                "XXDJ": this.data.pageParam.XXDJ, //学校等级
                "ORG_DM": this.data.pageParam.ORG_DM, //学校代码
                "XXBXLXM": this.data.pageParam.XXBXLXM, //办学类型
                // "ASC":"",
                "XXZDCXLXDM": this.data.pageParam.XXZDCXLXDM, //城乡类型
                // "limit":"20",
                "page": this.data.pageParam.page, //分页 
            },
            then(data) {
                let datas = data.datas
                let deleteParam = {}
                if (datas && datas.length > 0) {
                    // 将数据集中的id放入删除集中的id
                    for (let i = 0; i < datas.length; i++) {
                        let tmp = datas[i]
                        deleteParam[tmp.CONTENT_ID] = false
                    }
                    // 复制老的删除集至新的删除集
                    for (let i in this.deleteParam) {
                        deleteParam[i] = this.data.deleteParam[i]
                    }
                    this.data.deleteParam = deleteParam
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
                    deleteParam: this.data.deleteParam
                })
            }
        })
    },
    // 修改 学校代码
    inputXxdm({detail}) {
        this.data.pageParam.ORG_DM = detail.value
        this.setData({
            pageParam: this.data.pageParam
        })
    },
    // 选择 办学类型 办学模式 城乡类型 学校等级
    changeBxlx(e) {
        let checkedOption = this.data.searchCondition.DM_BXLX[e.detail.value]
        this.data.pageParam.XXBXLXM = checkedOption.DMMX_CODE
        this.data.pageParam.XXBXLXMMC = checkedOption.DMMX_MC
        this.setData({
            pageParam: this.data.pageParam
        })
    },
    changeBxms(e) {
        let checkedOption = this.data.searchCondition.DM_BXMS[e.detail.value]
        this.data.pageParam.XXBBM = checkedOption.DMMX_CODE
        this.data.pageParam.XXBBMMC = checkedOption.DMMX_MC
        this.setData({
            pageParam: this.data.pageParam
        })
    },
    changeCxlx(e) {
        let checkedOption = this.data.searchCondition.DM_XXZDCXLX[e.detail.value]
        this.data.pageParam.XXZDCXLXDM = checkedOption.DMMX_CODE
        this.data.pageParam.XXZDCXLXDMMC = checkedOption.DMMX_MC
        this.setData({
            pageParam: this.data.pageParam
        })
    },
    changeXxdj(e) {
        let checkedOption = this.data.searchCondition.DM_XXDJ[e.detail.value]
        this.data.pageParam.XXDJ = checkedOption.DMMX_CODE
        this.data.pageParam.XXDJMC = checkedOption.DMMX_MC
        this.setData({
            pageParam: this.data.pageParam
        })
    },
    // 搜素列表
    searchList({
        detail
    }) {
        this.data.pageParam.keyword = detail.value
        this.pageList(true)
    },
    // 去预览
    toPreview({
        currentTarget
    }) {
        let id = currentTarget.dataset.id
        if (id) {
            wx.navigateTo({
                url: '/pages/xxglddb/xxglddb-preview/xxglddb-preview?id=' + id
            })
        }
    },
})