const app = getApp()
Page({
  data: {
    // 新增 删除 审核 处理 验收
    hasXzAuth: false,
    hasScAuth: false,
    hasShAuth: false,
    hasClAuth: false,
    hasYsAuth: false,
    // 删除显示隐藏
    deleteShow: true,
    // 搜索以及分页参数
    pageParam: {
      // 学段
      xd: '',
      // 整改类型
      zglx: '',
      // 状态
      ztId: '',
      // 科室
      ksId: '',
      xdMc: '',
      ksMc: '',
      zglxMc: '',
      ztMc: '',
      // 页码
      page: 1,
      // 关键字
      keyword: ''
    },
    // 列表数据
    dataList: [],
    // 搜索参数
    searchCondition: {
      // 学段选择列表
      DM_XD: [],
      // 整改类型选择列表
      DM_DD_ZGXSLY: [
        {DMMX_CODE:"1",DMMX_MC:"全部"},
        {DMMX_CODE:"1",DMMX_MC:"经常性督导整改"},
        {DMMX_CODE:"2",DMMX_MC:"投诉整改"},
        {DMMX_CODE:"3",DMMX_MC:"其他整改"},
      ],
      ksList: [],
      DM_DD_CLZT: [], // 状态
    },
    // 删除参数
    deleteParam: {
      '_CHECK_ALL_': false
    },
    // 徽标样式
    constParam: {
      ztClass: {
        '21': 'fs',
        '22': 'fs',
        '23': 'zgz',
        '24': 'qs',
        '25': 'qs',
        '26': 'zgwc',
      }
    },
    // 加载更多的提示信息
    loadMore: {
        text: "正在加载",
        show: true
    }
  },
  onLoad() {
    this.has()
    this.initData()
  },
  onReachBottom() {
    this.data.loadMore.show = true
    this.data.loadMore.show = "正在加载..."
    this.setData({ loadMore: this.data.loadMore })
    this.pageList()
  },
  // 加载数据
  initData() {
    app.$kwz.loadDms('DM_DD_CLZT,DM_XD', dms => {
      this.data.searchCondition.DM_XD = app.$kwz.copyJson(dms.DM_XD) || {}
      // 该代码表将整改通知的状态一起放进去了。要将他截出来
      let DM_DD_CLZT = app.$kwz.copyJson(dms.DM_DD_CLZT) || {}
      for (let i in DM_DD_CLZT) {
        if (DM_DD_CLZT[i].DMMX_CODE > 20) {
          this.data.searchCondition.DM_DD_CLZT.push({
            DMMX_CODE: DM_DD_CLZT[i].DMMX_CODE,
            DMMX_MC: DM_DD_CLZT[i].DMMX_MC
          })
        }
      }
      // 给选项加“全部”。其实就是显示全部，实际为空值，后台判断空为全部
      this.data.searchCondition.DM_XD.unshift({
        DMMX_CODE: "", DMMX_MC: "全部"
      })
      this.data.searchCondition.DM_DD_CLZT.unshift({
        DMMX_CODE: "", DMMX_MC: "全部"
      })
      app.$kwz.ajax.ajaxUrl({
      	url: '/ddjl/getKsList',
        type: 'POST',
        page: this,
        then (data) {
      		let datas = data.datas
      		if (datas && datas.KSLIST && datas.KSLIST.length > 0) {
            let ksList = []
            for (let i = 0; i < datas.KSLIST.length; i++) {
              ksList.push({
                name: datas.KSLIST[i].ORG_MC,
                value: datas.KSLIST[i].ORG_ID
              })
            }
            ksList.unshift({
              name:"全部",value:""
            })
            this.data.searchCondition.ksList = ksList
          }
          this.setData({ searchCondition: this.data.searchCondition })
      	}
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
      url: '/dd_zgxs/doPageList/xsyj',
      type: 'POST',
      page: this,
      data: {
        page: this.data.pageParam.page,
        XD: this.data.pageParam.xd,
        XXMC: this.data.pageParam.keyword,
        XS_ORG_ID: this.data.pageParam.ksId,
        ZGXSLY: this.data.pageParam.zglx,
        CLZTDM: this.data.pageParam.ztId,
      },
      then(data) {
        let datas = data.datas
        let deleteParam = {}
        if (datas && datas.length > 0) {
          // 将数据集中的id放入删除集中的id
          for (let i = 0; i < datas.length; i++) {
            let tmp = datas[i]
            tmp.ztClass = this.data.constParam.ztClass[tmp.CLZTDM]
            deleteParam[tmp.ZGXSID] = false
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
  // 选择搜索条件 => 学段 科室 整改类型  状态
  changeXd(e) {
    let checkedOption = this.data.searchCondition.DM_XD[e.detail.value]
    this.data.pageParam.xd = checkedOption.DMMX_CODE
    this.data.pageParam.xdMc = checkedOption.DMMX_MC
    this.setData({
      pageParam: this.data.pageParam
    })
  },
  changeKs(e) {
    let checkedOption = this.data.searchCondition.ksList[e.detail.value]
    this.data.pageParam.ksId = checkedOption.DMMX_CODE
    this.data.pageParam.ksMc = checkedOption.DMMX_MC
    this.setData({
      pageParam: this.data.pageParam
    })
  },
  changeZglx(e) {
    let checkedOption = this.data.searchCondition.DM_DD_ZGXSLY[e.detail.value]
    this.data.pageParam.zglx = checkedOption.DMMX_CODE
    this.data.pageParam.zglxMc = checkedOption.DMMX_MC
    this.setData({
      pageParam: this.data.pageParam
    })
  },
  changeZt(e) {
    let checkedOption = this.data.searchCondition.DM_DD_CLZT[e.detail.value]
    this.data.pageParam.ztId = checkedOption.DMMX_CODE
    this.data.pageParam.ztMc = checkedOption.DMMX_MC
    this.setData({
      pageParam: this.data.pageParam
    })
  },
  // 搜素列表
  searchList(e) {
    this.data.pageParam.keyword = e.detail.value
    this.pageList(true)
  },
  // 按钮权限判定
  has() {
    app.$kwz.hasAuth('dd_zgxs/toZgtz/XSYJ', (auth) => {
      auth ? this.setData({ hasXzAuth: auth }) : ""
    })
    app.$kwz.hasAuth('dd_zgxs/doDeleteBatch/XSYJ', (auth) => {
      auth ? this.setData({ hasScAuth: auth }) : ""
    })
    app.$kwz.hasAuth('dd_zgxs/xsyj_sh', (auth) => {
      auth ? this.setData({ hasShAuth: auth }) : ""
    })
    app.$kwz.hasAuth('dd_zgxs/xsyj_deal', (auth) => {
      auth ? this.setData({ hasClAuth: auth }) : ""
    })
    app.$kwz.hasAuth('dd_zgxs/zgtz_done', (auth) => {
      auth ? this.setData({ hasYsAuth: auth }) : ""
    })
  },
  // 去 协商意见 新增 处理|验收  
  toZg() {
    wx.navigateTo({ url: "/pages/zggz/zggz" })
  },
  toAdd(e) {
    let id = e.currentTarget.dataset.id
    if (id !== 'add') { // 不是新增就是审核
      wx.navigateTo({ url: "/pages/zggz/xsyj-add/xsyj-add?ZGXSID=" + id })
    } else {
      wx.navigateTo({ url: "/pages/zggz/xsyj-add/xsyj-add" })
    }
  },
  toZgxs(e) {
    let status = e.currentTarget.dataset.status
    let id = e.currentTarget.dataset.id
    // 不是详情那就是-处理验收
    if (status !== undefined) {
      wx.navigateTo({ url: `/pages/zggz/xsyj-preview/xsyj-preview?ZGXSID=${id}&SF=${status}` })
    } else {
      wx.navigateTo({ url: "/pages/zggz/xsyj-preview/xsyj-preview?ZGXSID=" + id })
    }
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
        url: '/dd_zgxs/doDeleteBatch/ZGTZ',
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
    this.setData({ deleteShow: true })
  },
})