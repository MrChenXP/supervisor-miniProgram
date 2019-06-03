// pages/xcdd/xcdd.js
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
  goAdd(){
    wx.navigateTo({ url: '/pages/xcdd/xcdd-add/xcdd-add' })
  }
 
})