// pages/gzjh/gzjh.js
const app = getApp()
Page({
    data: {
        // 新增 修改 删除 处理 督导 不参加(签收) 权限
        hasXzAuth: false,
        hasXgAuth: false,
        hasScAuth: false,
        hasClAuth: false,
        hasDdAuth: false,
        hasBcjAuth: false,
        // 删除 采集明细 显示隐藏
        deleteShow: true,
        cjmxShow: false,
        // 搜索以及分页参数
        pageParam: {
            // 学段
            xd: '',
            // 整改类型
            xq: '',
            xdMc: '',
            xqMc: '',
            sjly:"",
            sjlyMC:"",
            // 页码
            page: 1,
            // 关键字
            keyword: ''
        },
        dataList: [],
        // 搜索参数
        searchCondition: {
            // 学段选择列表
            DM_XD: [],
            // 整改类型选择列表
            DM_XQ: [],
            // 数据来源选择列表
            SJLY: [{
                    DMMX_CODE: "",
                    DMMX_MC: "全部"
                },
                {
                    DMMX_CODE: "0",
                    DMMX_MC: "工作安排"
                },
                {
                    DMMX_CODE: "1",
                    DMMX_MC: "工作计划"
                }
            ]
        },
        // 删除参数
        deleteParam: {
            '_CHECK_ALL_': false
        },
        // 徽标样式
        constParam: {
            ztClass: {
                '1': 'wwt',
                '2': 'ybwt',
                '3': 'fzwt',
                '4': 'xwt',
                '5': 'yzwt',
            }
        },
        // 加载更多的提示信息
        loadMore: {
            text: "正在加载",
            show: true
        },
        // 采集页面初始化数据
        cjym:{},
        // 采集项数据
        cjmxList:[],
        // 采集明细按钮
        cjmxButton: [{
            name: '返回'
            },
            {
                name: '保存草稿',
                color: '#04a8e5'
            },
            {
                name: '保存并上报',
                color: '#f1a325'
            }],
        // 用户数据
        user:{}
    },
    onLoad(param) {
        this.has()
        this.initData()
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
    initData() {
        app.$kwz.loadDms('DM_XD', dms => {
            this.data.searchCondition.DM_XD = app.$kwz.copyJson(dms.DM_XD) || {}
            // 给选项加“全部”。其实就是显示全部，实际为空值，后台判断空为全部
            this.data.searchCondition.DM_XD.unshift({
                DMMX_CODE: "",
                DMMX_MC: "全部"
            })
            // 加载学期
            app.$kwz.ajax.ajaxUrl({
                url: '/jc_xq/doList',
                type: 'POST',
                page: this,
                then(data) {
                    let datas = data.datas
                    let xqs = [{
                        DMMX_MC: '全部',
                        DMMX_CODE: ''
                    }]
                    if (datas && datas.length > 0) {
                        for (let i = 0; i < datas.length; i++) {
                            xqs.push({
                                DMMX_MC: datas[i].XQ_MC,
                                DMMX_CODE: datas[i].XQ_ID
                            })
                        }
                    }
                    // 获取当前学期
                    app.$kwz.ajax.ajaxUrl({
                        url: '/jc_xq/getCurXq',
                        type: 'POST',
                        page: this,
                        then(data) {
                            let datas = data.datas
                            if (datas && datas.curXq && datas.curXq.XQ_ID) {
                                this.data.pageParam.xq = datas.curXq.XQ_ID
                                this.data.pageParam.xqMc = datas.curXq.XQ_MC
                            }
                            this.data.searchCondition.DM_XQ = xqs
                            this.setData({
                                searchCondition: this.data.searchCondition,
                                pageParam: this.data.pageParam
                            })
                            this.pageList(true)
                        }
                    })
                }
            })
            app.$kwz.getLoginUser((user) => {
                this.setData({user})
            }, this)
        })
    },
    // 加载列表 type=>true（覆盖式）/false（增量式）
    pageList(type) {
        if (type) {
            this.data.pageParam.page = 1
        }
        app.$kwz.ajax.ajaxUrl({
            url: '/dd_gzap/doPageList/DDGZAP_GP',
            type: 'POST',
            page: this,
            data: {
                page: this.data.pageParam.page,
                XD: this.data.pageParam.xd,
                ORG_ID_TARGET: this.data.pageParam.keyword,
                XQID: this.data.pageParam.xq,
                DD_SOURCE: this.data.pageParam.sjly
            },
            then(data) {
                let datas = data.datas
                let deleteParam = {}
                if (datas && datas.length > 0) {
                    // 将数据集中的id放入删除集中的id
                    for (let i = 0; i < datas.length; i++) {
                        let tmp = datas[i]
                        tmp.ztClass = this.data.constParam.ztClass[tmp.STATUS]
                        deleteParam[tmp.CONTENT_ID] = false
                        tmp.ISQS = tmp.ISCYR === 1 && tmp.QDZT === '1'
                        tmp.DDSD = tmp.YWSJ ? (tmp.YWSJ.substr(0, 10) + (tmp.SD === '1' ? ' 上午' : ' 下午')) : tmp.YWSJ
                        // 截取内容
                        tmp.TXT = app.$kwz.deleteImg(tmp.TXT)
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
    // 按钮权限判断
    has() {
        app.$kwz.hasAuth('dd_gzap/toAdd', (auth) => {
            auth ? this.setData({hasXzAuth: auth}) : ""
        })
        app.$kwz.hasAuth('dd_gzap/toUpdate', (auth) => {
            auth ? this.setData({hasXgAuth: auth}) : ""
        })
        app.$kwz.hasAuth('dd_gzap/doDelete', (auth) => {
            auth ? this.setData({hasScAuth: auth}) : ""
        })
        app.$kwz.hasAuth('dd_gzap/doDeal', (auth) => {
            auth ? this.setData({hasClAuth: auth}) : ""
        })
        app.$kwz.hasAuth('dd_gzap/doSelectDdjlByGzapid', (auth) => {
            auth ? this.setData({hasDdAuth: auth}) : ""
        })
        app.$kwz.hasAuth('dd_gzap/toQs', (auth) => {
            auth ? this.setData({hasBcjAuth: auth}) : ""
        })
    },
    // 选择搜索条件 => 学段 学期 数据来源
    changeXd(e) {
        let checkedOption = this.data.searchCondition.DM_XD[e.detail.value]
        this.data.pageParam.xd = checkedOption.DMMX_CODE
        this.data.pageParam.xdMc = checkedOption.DMMX_MC
        this.setData({
            pageParam: this.data.pageParam
        })
    },
    changeXq(e) {
        let checkedOption = this.data.searchCondition.DM_XQ[e.detail.value]
        this.data.pageParam.xq = checkedOption.DMMX_CODE
        this.data.pageParam.xqMc = checkedOption.DMMX_MC
        this.setData({
            pageParam: this.data.pageParam
        })
    },
    changeSjly(e) {
        let checkedOption = this.data.searchCondition.SJLY[e.detail.value]
        this.data.pageParam.sjly = checkedOption.DMMX_CODE
        this.data.pageParam.sjlyMc = checkedOption.DMMX_MC
        this.setData({
            pageParam: this.data.pageParam
        })
    },
    // 搜素列表
    searchList(e) {
        this.data.pageParam.keyword = e.detail.value
        this.pageList(true)
    },
    // 删除
    deleteAction() {
        this.setData({
            deleteShow: false
        })
    },
    // 全选和反选
    checkAll() {
        this.data.deleteParam._CHECK_ALL_ = !this.data.deleteParam._CHECK_ALL_
        for (let i in this.data.deleteParam) {
            this.data.deleteParam[i] = this.data.deleteParam._CHECK_ALL_
        }
        this.setData({
            deleteParam: this.data.deleteParam
        })
    },
    // 删除选择
    checkAction(e) {
        let id = e.currentTarget.dataset.id
        if (id) {
            this.data.deleteParam[id] = !this.data.deleteParam[id]
            this.setData({
                deleteParam: this.data.deleteParam
            })
        }
    },
    // 确认删除
    confirmDeleteAction() {
        let ids = []
        for (let i in this.data.deleteParam) {
            if (this.data.deleteParam[i] && i != '_CHECK_ALL_') {
                ids.push(i)
            }
        }
        if (ids.length > 0) {
            app.$kwz.ajax.ajaxUrl({
                url: '/dd_gzap/doDelete',
                type: 'POST',
                data: {
                    ids: ids.join(',')
                },
                page: this,
                then(response) {
                    wx.hideToast()
                    this.pageList(true)
                    app.$kwz.alert('操作成功')
                }
            })
        }
        this.setData({
            deleteShow: true
        })
    },
    // 处理
    doDispose(e) {
        let id = e.currentTarget.dataset.id
        if (id) {
            app.$kwz.ajax.ajaxUrl({
                url: '/dd_gzap/doDeal',
                type: 'POST',
                data: {
                    CONTENT_ID: id
                },
                page: this,
                then(response) {
                    this.pageList(true)
                    app.$kwz.alert('操作成功')
                }
            })
        }
    },
    // 不参加
    doBcj(e) {
        let id = e.currentTarget.dataset.id
        if (id) {
            app.$kwz.ajax.ajaxUrl({
                url: '/dd_gzap/doQs',
                type: 'POST',
                data: {
                    CONTENT_ID: id,
                    QSZT: '3'
                },
                page: this,
                then(response) {
                    this.pageList(true)
                    app.$kwz.alert('操作成功')
                }
            })
        }
    },
    // 自评按钮
    doZp(e){
        let bzid = e.currentTarget.dataset.bzid
        let mb_org_id = e.currentTarget.dataset.mb_org_id
        // 获取初始化采集页面数据
        app.$kwz.ajax.ajaxUrl({
            url: 'dz_cjpc/doSelectCjmb',
            type: 'POST',
            data: {
                PCID: bzid, 
                MB_ORG_ID: mb_org_id
            },
            page: this,
            then(response) {
                if(response.datas){ // 有时会返回null 这样就没有目标机构id了
                    this.data.cjym = response.datas
                } else{
                    this.data.cjym.MBORGID = mb_org_id
                }
                this.data.cjym.bzid = bzid
                if (this.data.cjym.SFSB == 0){
                    this.getCjx(this.data.cjym)
                    this.cjmxShow()
                } else{
                    this.toPg()
                }
            }
        })
    },
    // 获取采集项数据 cjmxButton
    getCjx(cjym){
        app.$kwz.ajax.ajaxUrl({
            url: 'dz_cjtb/doDetail',
            type: 'POST',
            data: {
                MBID: cjym.MBID,
                TBDX: 'shixian'
            },
            page: this,
            then(response) {
                this.setData({ cjmxList: response.datas})
            }
        })
    },
    // 点击采集明细按钮
    cjmxTap({detail}){
        let i = detail.index,
            GROUP_ARR = [],
            data = {}
        if (i == 0) {
            this.cjmxShow()
            return
        }
        for(let g in this.data.cjmxList){
            GROUP_ARR.push({
                XMID: this.data.cjmxList[g].XMID,
                VALUE_SOURCE: this.data.cjmxList[g].VALUE_SOURCE ? this.data.cjmxList[g].VALUE_SOURCE: "",
                FID: this.data.cjmxList[g].FID ? this.data.cjmxList[g].FID : "",
                VID: this.data.cjmxList[g].VID ? this.data.cjmxList[g].VID : ""
            })
            data["XMID_"+g] = this.data.cjmxList[g].XMID
            data["VID_" + g]=this.data.cjmxList[g].VID ? this.data.cjmxList[g].VID : ""
            data["VALUE_" + g] = this.data.cjmxList[g].VALUE_SOURCE ? this.data.cjmxList[g].VALUE_SOURCE : ""
        }
        data.GROUP_ARR = JSON.stringify(GROUP_ARR)
        data.MBID = this.data.cjym.MBID
        data.MBORGID = this.data.cjym.MBORGID
        data.YEAR = this.data.cjym.YEAR
        if(i==1){
            app.$kwz.ajax.ajaxUrl({
                url: 'dz_cjtb/doSave',
                type: 'POST',
                data:data,
                page: this,
                then(response) {
                    this.cjmxShow()
                    app.$kwz.alert("保存成功")
                }
            })
        } else{
            app.$kwz.ajax.ajaxUrl({
                url: 'dz_cjtb/doSb/' + this.data.cjym.YWLX,
                type: 'POST',
                data: data,
                page: this,
                then(response) {
                    this.cjmxShow()
                    app.$kwz.alert("保存成功")
                    this.toPg()
                }
            })
        }
    },
    // 采集明细 显示隐藏
    cjmxShow(){
        this.setData({ cjmxShow: !this.data.cjmxShow})
    },
    // 修改采集箱数据
    changeCjx(e){
        let index = e.currentTarget.dataset.index
        let item = e.currentTarget.dataset.item
        let val = e.detail.value
        this.data.cjmxList[index].VALUE_SOURCE = val
    },
    // 去 新增、编辑  去预览 去督导 去评估
    goAdd(e) {
        let id = e.currentTarget.dataset.id
        if (id) {
            wx.navigateTo({
                url: '/pages/gzjh/gzjh-add/gzjh-add?CONTENT_ID=' + id
            })
        } else {
            wx.navigateTo({
                url: '/pages/gzjh/gzjh-add/gzjh-add'
            })
        }
    },
    toPreview(e) {
        let id = e.currentTarget.dataset.id
        if (id) {
            wx.navigateTo({
                url: '/pages/gzjh/gzjh-preview/gzjh-preview?CONTENT_ID=' + id
            })
        }
    },
    toDD(e) {
        let id = e.currentTarget.dataset.id
        if (id) {
            wx.navigateTo({
                url: '/pages/xcdd/xcdd-add/xcdd-add?workplanId=' + id
            })
        }
    },
    toPg() {
        app.$kwz.ajax.ajaxUrl({
            url: 'ddpg_mb/doSelectPgmb',
            type: 'POST',
            data: {
                PCID: this.data.cjym.bzid,
                MB_ORG_ID: this.data.cjym.MBORGID
            },
            page: this,
            then(response) {
                let data = response.datas
                let url = `PID=${data.PID}&MBID=${data.MBID}&PCMC=${data.PCMC}&STATU=${data.STATU}&PCID=${data.PCID}&YWLX=${data.YWLX}&PGMC=${data.PGMC}`
                wx.navigateTo({
                    url: `/pages/pg/pg-zp/pg-zp?`+url
                })
            }
        })
    },
})