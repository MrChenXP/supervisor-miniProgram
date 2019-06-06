// pages/xcdd/xcdd.js
const app = getApp()

Page({
  data: {
    // 加载更多状态
    loadingType: "more",
    // 加载更多状态对应文字 键名不能改
    contentText: {
      contentdown: "上拉显示更多",
      contentrefresh: "正在加载...",
      contentnomore: "没有更多数据了"
    },
    // 删除显示隐藏
    deleteShow: true,
    // 搜索以及分页参数
    pageParam: {
      // 学段
      xd: '',
      // 整改类型
      xq: '',
      xdMc: '全部',
      xqMc: '',
      // 页码
      page: 1,
      // 关键字
      keyword: ''
    },
    dataList: [],
    // 搜索参数
    searchCondition: {
      // 学段选择列表
      DM_XD: [
        {
          DMMX_CODE: "", DMMX_MC: "全部"
        }
      ],
      // 整改类型选择列表
      DM_XQ: []
    },
    // 删除参数
    deleteParam: {
      '_CHECK_ALL_': false
    },
    // 徽标样式
    constParam: {
      ztClass: {
        '1': 'wwt',
        '2': 'qs',
        '3': 'zgz',
        '4': 'zgwc',
        '5': 'fs',
      }
    }
  },
  onLoad(){
    this.pageList()
  },
  // 加载列表 type=>true（覆盖式）/false（增量式）
  pageList(type) {
    if (type) {
      this.pageParam.page = 1
    }
    app.$kwz.ajax.ajaxUrl({
      url: '/ddjl/doSchoolPageList',
      type: 'POST',
      page: this,
      data: {
        page: this.data.pageParam.page,
        XD: this.data.pageParam.xd,
        XXMC: this.data.pageParam.keyword,
        XQID: this.data.pageParam.xq
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
          }
          // 复制老的删除集至新的删除集
          for (let i in this.deleteParam) {
            deleteParam[i] = this.data.deleteParam[i]
          }
          this.data.deleteParam = deleteParam
          this.data.pageParam.page++
          if (type) {
            this.data.dataList = datas
          } else {
            this.data.dataList.push(...datas)
            this.data.loadingType = "more"
          }
        } else {
          this.data.loadingType = "noMore"
          if (type) {
            this.data.dataList = []
          }
        }
        this.setData({
          dataList: this.data.dataList,
          loadingType: this.data.loadingType,
          deleteParam: this.data.deleteParam
        })
      }
    })
  },
  // 搜素列表
  searchList(e) {
    this.data.pageParam.keyword = e.detail.value
    this.pageList(true)
  },
  // 去新增
  goAdd(){
    wx.navigateTo({ url: '/pages/xcdd/xcdd-add/xcdd-add' })
  }
  
})