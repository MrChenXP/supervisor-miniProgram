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
    // 删除显示隐藏
    deleteShow: true,
    // 搜索以及分页参数
    pageParam: {
    	// 学段
    	xd: '',
    	// 整改类型
    	xq: '',
    	xdMc: '',
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
    	DM_XD: [],
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
        '2': 'ybwt',
        '3': 'fzwt',
        '4': 'xwt',
        '5': 'yzwt',
      }
    },
    // 加载更多的提示信息
    loadMore:{
      text: "上拉加载更多",
      show: false
    }
  },
  onLoad() {
    this.has()
    this.initData()
  },
  onReachBottom() {

  },
  // 初始化页面
  initData() {
    app.$kwz.loadDms('DM_XD', dms =>{
      this.data.searchCondition = app.$kwz.copyJson(dms) || {}
      // 给选项加“全部”。其实就是显示全部，实际为空值，后台判断空为全部
      this.data.searchCondition.DM_XD.unshift({
        DMMX_CODE: "", DMMX_MC: "全部"
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
    })
  },
  // 加载列表 type=>true（覆盖式）/false（增量式）
  pageList(type) {
    if (type) {
      this.data.pageParam.page = 1
    }
    app.$kwz.ajax.ajaxUrl({
      url: '/dd_gzap/doPageList/DDGZAP',
      type: 'POST',
      page: this,
      data: {
        page: this.data.pageParam.page,
        XD: this.data.pageParam.xd,
        ORG_ID_TARGET: this.data.pageParam.keyword,
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
            tmp.ISQS = tmp.ISCYR === 1 && tmp.QDZT === '1'
            tmp.DDSD = tmp.YWSJ ? (tmp.YWSJ.substr(0, 10) + (tmp.SD === '1' ? ' 上午' : ' 下午')) : tmp.YWSJ
            // 截取内容
            let text = datas[i].TXT
            text = text && text.length > 35 ? text.substr(0, 35) + '...' : text
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
        console.log(this.data.dataList)
        this.setData({
          dataList: this.data.dataList,
          loadMore: this.data.loadMore,
          deleteParam: this.data.deleteParam
        })
      }
    })  
  },
  // 按钮权限判断
  has(){
    app.$kwz.hasAuth('dd_gzap/toAdd',(auth)=>{
      auth ? this.setData({hasXzAuth: auth}) : ""
    })
    app.$kwz.hasAuth('dd_gzap/toUpdate', (auth) => {
      auth ? this.setData({ hasXgAuth: auth }) : ""
    })
    app.$kwz.hasAuth('dd_gzap/doDelete', (auth) => {
      auth ? this.setData({ hasScAuth: auth }) : ""
    })
    app.$kwz.hasAuth('dd_gzap/doDeal', (auth) => {
      auth ? this.setData({ hasClAuth: auth }) : ""
    })
    app.$kwz.hasAuth('dd_gzap/doSelectDdjlByGzapid', (auth) => {
      auth ? this.setData({ hasDdAuth: auth }) : ""
    })
    app.$kwz.hasAuth('dd_gzap/toQs', (auth) => {
      auth ? this.setData({ hasBcjAuth: auth }) : ""
    })
  },
  // 选择搜索条件 => 学段 学期
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
//     let ids = []
//     for (let i in this.data.deleteParam) {
//       if (this.data.deleteParam[i] && i != '_CHECK_ALL_') {
//         ids.push(i)
//       }
//     }
//     if (ids.length > 0) {
//       app.$kwz.ajax.ajaxUrl({
//         url: '/jc_content/doDelete/DDJL',
//         type: 'POST',
//         data: {
//           ids: ids.join(',')
//         },
//         page: this,
//         then(response) {
//     wx.hideToast()
//           app.$kwz.alert('操作成功')
//           this.pageList(true)
//         }
//       })
//     }
//     this.setData({deleteShow : true})
  },
  // 去新增 || 编辑
  goAdd(e) {
    let id = e.currentTarget.dataset.id
    if (id){
      wx.navigateTo({ url: '/pages/xcdd/xcdd-add/xcdd-add?CONTENT_ID=' + id })
    } else{
      wx.navigateTo({ url: '/pages/xcdd/xcdd-add/xcdd-add' })
    }
  },
  // 去预览
  toPreview(e) {
    let id = e.currentTarget.dataset.id
    if (id) {
      wx.navigateTo({ url: '/pages/xcdd/xcdd-preview/xcdd-preview?CONTENT_ID=' + id })
    }
  },
})