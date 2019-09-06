// pages/dxsl/dxsl-preview/dxsl-preview.js
const app = getApp()
Page({
    data: {
        // 富文本显示隐藏
        fwbShow: true,
        // 督学沙龙id
        contentId:"",
        // 不知道什么 获取督学沙龙数据要用的
        IS_RECORD:"",
        // 督学沙龙数据
        data:{},
        // 评论页码
        page: "1",
        // 评论列表
        dataList:[],
        // 回复下标
        hfI: 0,
        // 富文本值
        fwbValue:"",
        // 加载更多的提示信息
        loadMore: {
            text: "正在加载",
            show: true
        }
        
    },
    onLoad(param) {
        if (param && param.CONTENT_ID) {
            this.data.contentId = param.CONTENT_ID
            this.data.IS_RECORD = param.IS_RECORD
            this.loadData()
        }
    },
    onReachBottom: function () {
        this.data.loadMore.show = true
        this.data.loadMore.show = "正在加载..."
        this.setData({
            loadMore: this.data.loadMore
        })
        this.pageList()
    },
    // 初始化页面
    loadData() {
        this.getBbs()
        app.$kwz.hasAuth('jc_reply/doPageList', (auth) => {
            auth ? this.pageList() : ""
        })
    },
    // 获取帖子内容
    getBbs(){
        app.$kwz.ajax.ajaxUrl({
            url: 'jc_content/doSelectByPrimary/DDDXSL',
            type: 'POST',
            data: {
                CONTENT_ID: this.data.contentId,
                IS_RECORD: this.data.IS_RECORD,
            },
            page: this,
            then(response) {
                let datas = response.datas
                datas.TXT = app.$kwz.formatImg(datas.TXT)
                this.setData({ data: datas })
            }
        })
    },
    // 获取评论列表 type=>true（覆盖式）/false（增量式）
    pageList(type){
        if (type) {
            this.data.page = 1
        }
        app.$kwz.ajax.ajaxUrl({
            url: 'jc_reply/doPageList',
            type: 'POST',
            page: this,
            data: {
                page: this.data.page,
                rows: "10",
                COMMENT_ID: this.data.contentId
            },
            then(data) {
                let datas = data.datas
                if (datas && datas.length > 0) {
                    for (let i = 0; i < datas.length; i++) {
                        let tmp = datas[i]
                        tmp.REPLY_CONTENT = app.$kwz.formatImg(tmp.REPLY_CONTENT)
                        tmp.REPLY_CONTENT2 = app.$kwz.formatImg(tmp.REPLY_CONTENT2)
                    }
                    this.data.page++
                    if (type) {
                        this.data.dataList = datas
                        if (datas.length < 10) {
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
    // 赞
    zan(e){
        let id = e.currentTarget.dataset.id
        let i = e.currentTarget.dataset.i
        app.$kwz.ajax.ajaxUrl({
            url: 'jc_reply/doUpdateUD',
            type: 'POST',
            page: this,
            data: {
                REPLY_ID: id,
                reply_type: 'ups'
            },
            then(data) {
                if (data.statusCode == 200){
                    this.data.dataList[i].UPS++
                    this.setData({dataList: this.data.dataList})
                }
            }
        })
    },
    // 踩
    cai(e){
        let id = e.currentTarget.dataset.id
        let i = e.currentTarget.dataset.i
        app.$kwz.ajax.ajaxUrl({
            url: 'jc_reply/doUpdateUD',
            type: 'POST',
            page: this,
            data: {
                REPLY_ID: id,
                reply_type: 'downs'
            },
            then(data) {
                if (data.statusCode == 200) {
                    this.data.dataList[i].DOWNS++
                    this.setData({ dataList: this.data.dataList })
                }
            }
        })
    },
    // 添加评论
    tjpl(){
        this.fwbShow()
        this.data.hfI = -1
    },
    // 回复
    hf(e){
        let i = e.currentTarget.dataset.i
        this.data.hfI = i
        this.fwbShow()
    },
    // 富文本输入
    fwbInput({ detail }) {
        this.data.fwbValue = detail.data
    },
    // 提交
    tj(){
        if (!this.data.fwbValue){
            app.$kwz.alert("内容不能为空")
            return
        }
        let TO_REPLY_ID = ""
        if (this.data.hfI > -1){
            TO_REPLY_ID = this.data.dataList[this.data.hfI].REPLY_ID
        }
        app.$kwz.ajax.ajaxUrl({
            url: 'jc_reply/doAdd',
            type: 'POST',
            data: {
                COMMENT_ID: this.data.contentId,
                REPLY_ID: "",
                REPLY_CONTENT: this.data.fwbValue,
                TO_REPLY_ID: TO_REPLY_ID
            },
            page: this,
            then(response) {
                this.fwbShow()
                this.pageList(true)
            }
        })
    },
    // 富文本显示隐藏
    fwbShow(){
        this.setData({fwbShow: !this.data.fwbShow})
    },
    catchtouchmove() { }
})