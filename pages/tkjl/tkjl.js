const app = getApp()
Page({
  data: {
    // 新增 删除 修改 权限
    hasXzAuth: false,
    hasScAuth: false,
    hasXgAuth: false,
    // 删除显示隐藏
    deleteShow: true,
    // 搜索以及分页参数
    pageParam: {
    	startTime: '',  // 开始时间
    	endTime: '',  // 结束时间
    	keyword: '',
    	page: 1
    },
    // 列表数据
    dataList: [],
    deleteParam: {
    	'_CHECK_ALL_': false
    },
    constParam: {
    },
    // 加载更多的提示信息
    loadMore:{
        text: "正在加载",
        show: true
    }
  },
  onLoad() {
    this.has()
    this.initData()
  },
  onReachBottom: function () {
    this.data.loadMore.show= true
    this.data.loadMore.show= "正在加载..."
    this.setData({ loadMore: this.data.loadMore})
    this.pageList()
  },
  // 加载数据
  initData() {
  	this.pageList(true)
  },
  // 加载列表 type=>true（覆盖式）/false（增量式）
  pageList(type) {
    if (type) {
      this.data.pageParam.page = 1
    }
    app.$kwz.ajax.ajaxUrl({
      url: '/jc_pgbzmx/doSchoolPageList/TKJL',
      type: 'POST',
      page: this,
      data: {
        start_time: this.data.pageParam.startTime,
        end_time: this.data.pageParam.endTime,
        page: this.data.pageParam.page,
        XXMC: this.data.pageParam.keyword,
        // 后端不知道是什么 先传''
        MB_ORG_ID: '',
        ASC: '',
        ORDERBY: '',
      },
      then(data) {
        let datas = data.datas
        let deleteParam = {}
        if (datas && datas.length > 0) {
          // 将数据集中的id放入删除集中的id
          for (let i = 0; i < datas.length; i++) {
            let tmp = datas[i]
            deleteParam[tmp.MXID] = false
          }
          // 复制老的删除集至新的删除集
          for (let i in this.deleteParam) {
            deleteParam[i] = this.data.deleteParam[i]
          }
          this.data.deleteParam = deleteParam
          this.data.pageParam.page++
          if (type) {
            this.data.dataList = datas
            if(datas.length < 20){
              this.data.loadMore.show = false
              this.data.loadMore.text = "没有更多数据了"
            }
          } else {
            this.data.dataList.push(...datas)
            this.data.loadMore.show= false
            this.data.loadMore.text= "上拉显示更多"
          }
        } else {
          this.data.loadMore.show= false
          this.data.loadMore.text= "没有更多数据了"
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
  // 按钮权限
  has(){
    app.$kwz.hasAuth('jc_pgbzmx/toAdd',(auth)=>{
      auth ? this.setData({hasXzAuth: auth}) : ""
    })
    app.$kwz.hasAuth('jc_pgbz/toUpdate', (auth) => {
      auth ? this.setData({ hasXgAuth: auth }) : ""
    })
    app.$kwz.hasAuth('jc_pgbzmx/doDelete/TKJL', (auth) => {
      auth ? this.setData({ hasScAuth: auth }) : ""
    })
  },
  // 修改开始时间
  changeStart({detail}) {
    this.data.pageParam.startTime = detail.value
    this.setData({ pageParam: this.data.pageParam})
  },
  // 修改结束时间
  changeEnd({detail}) {
    this.data.pageParam.endTime = detail.value
    this.setData({ pageParam: this.data.pageParam})
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
        url: '/jc_pgbzmx/doDelete/TKJL',
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
    this.setData({deleteShow : true})
  },
  // 去 新增|修改 去预览 
  toAdd(e) {
    let id = e.currentTarget.dataset.id
    let isNew = e.currentTarget.dataset.isnew
    if (id){
      wx.navigateTo({ url: '/pages/tkjl/tkjl-add/tkjl-add?id=' + id + "&isNew=" + isNew})
    } else{
      wx.navigateTo({ url: '/pages/tkjl/tkjl-add/tkjl-add' })
    }
  },
  toPreview(e) {
    let id = e.currentTarget.dataset.id
    let isNew = e.currentTarget.dataset.isnew
    if (id) {
      wx.navigateTo({ url: '/pages/tkjl/tkjl-preview/tkjl-preview?id=' + id + "&isNew=" + isNew})
    }
  },
})