//index.js
const app = getApp()
Page({
    data: {
        // 控制标题栏选中样式
        isActive: 0,
        // 左侧图标属性值
        extraIcon: {
            type: 'kw-circle',
            color: '#00bdfd',
            size: '16'
        },
        // 选择地区显示隐藏
        xzdqShow: true,
        // 轮播图图片路径
        newsImaUrl: [],
        // 标题栏文字
        btList: [],
        // 整个新闻列表数据
        newsBtList: [],
        // 列表的业务类型
        ywlxList: [],
        // 新闻的列表页数
        pageList: [],
        // 选择地区 数据
        xzdqData: 15,
        // 加载更多的提示信息
        loadMore: []
    },
    // onLoad事件
    onLoad() {
        this.loadIndexData()
    },
    // 上拉触底事件 加载下一页新闻
    onReachBottom() {
        this.data.loadMore[this.data.isActive].show = true
        this.data.loadMore[this.data.isActive].text = "正在加载..."
        this.setData({
            loadMore: this.data.loadMore
        })
        app.$kwz.ajax.ajaxUrl({
            url: '/jc_content/open/doCmsFbPageList/' + this.data.ywlxList[this.data.isActive],
            type: 'POST',
            page: this,
            data: {
                page: this.data.pageList[this.data.isActive],
                rows: "5"
            },
            success(data) {
                this.data.pageList[this.data.isActive] += 1
                this.data.newsBtList[this.data.isActive].push(...data.datas)
                this.data.loadMore[this.data.isActive].show = false
                if (data.datas.length >= 5) {
                    this.data.loadMore[this.data.isActive].text = "上拉显示更多"
                } else {
                    this.data.loadMore[this.data.isActive].text = "没有更多数据了"
                }
                this.setData({
                    newsBtList: this.data.newsBtList,
                    loadMore: this.data.loadMore
                })
            }
        })
    },
    // 加载首页数据
    loadIndexData() {
        app.$kwz.ajax.ajaxUrl({
            url: '/jc_mobile/open/getYkXtsz',
            type: 'POST',
            page: this,
            success(data) {
                if (data && '200' == data.statusCode) {
                    let ykpic = data.datas.YKPIC
                    let ykinfo = data.datas.YKINFO;
                    // 首页图片
                    if (ykpic && ykpic.length > 0) {
                        for (let i = 0; i < ykpic.length; i++) {
                            app.$kwz.cacheAttach({
                                url: '/index/visit/doDownload?F_ID=' + ykpic[i].F_ID,
                                page: this,
                                success(filepath) {
                                    if (filepath.statusCode === 200) {
                                        let newsImaUrl = this.data.newsImaUrl
                                        newsImaUrl.push(filepath.tempFilePath)
                                        this.setData({
                                            newsImaUrl
                                        })
                                    }
                                }
                            })
                        }
                    } else {
                        this.data.newsImaUrl = ['/static/images/defaults.png']
                    }
                    // 首页新闻
                    if (ykinfo && ykinfo.length > 0) {
                        for (let i = 0; i < ykinfo.length; i++) {
                            if (ykinfo[i].CONTENT.length >= 5) {
                                this.data.loadMore.push({
                                    text: "上拉显示更多",
                                    show: false
                                })
                            } else {
                                this.data.loadMore.push({
                                    text: "没有更多数据了",
                                    show: false
                                })
                            }
                            this.data.btList.push(ykinfo[i].YWMC)
                            this.data.newsBtList.push(ykinfo[i].CONTENT)
                            this.data.ywlxList.push(ykinfo[i].YWLX)
                            this.data.pageList.push(2)
                        }
                    }
                    // 因组织架构图并不能从后端配出来，顾前端手动添加
                    this.data.btList.push("组织架构图")
                    this.data.newsBtList.push([{
                        TITLE: "组织架构图",
                        CONTENT_ID: "组织架构图"
                    }])
                    this.setData({
                        btList: this.data.btList,
                        newsBtList: this.data.newsBtList,
                        ywlxList: this.data.ywlxList,
                        pageList: this.data.pageList,
                        loadMore: this.data.loadMore,
                        newsImaUrl: this.data.newsImaUrl
                    })
                }
            }
        })
    },
    // 更改标题栏选中值
    changeBt(e) {
        this.setData({
            isActive: e.currentTarget.dataset.index,
        });
    },
    //  选择地区显示隐藏
    xzdqClose(){
        this.setData({xzdqShow: !this.data.xzdqShow})
    } 
})