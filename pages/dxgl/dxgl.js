const app = getApp()
Page({
  data: {
    // 列表数据
    dataList: [],
    // 搜索以及分页参数
    pageParam: {
    	// 分页
    	page: 1,
      // 姓名
      XM: "",
      // 电话
      DH: "",
      // 编号
      BH: "",
      // 督学类型
      DXLX:"",
      // 督学类型码
      DXLXM:"",
      // 状态
      YXZT:"1",
      // 状态名称
      YXZTMC:"在岗",
    	// 关键字 账号
    	keyword: '',
    },
    // 搜索列表选择数据
    searchCondition: {
      // 督学类型选择列表
      DM_DD_DXLX:{},
      // 状态选择列表
      YXZTList:[
        {
          DMMX_CODE:"0",
          DMMX_MC:"已删除"
        },{
          DMMX_CODE:"1",
          DMMX_MC:"在岗"
        },{
          DMMX_CODE:"3", // 确实是3
          DMMX_MC:"离职/离岗"
        },
      ]
    },
    // 加载更多的提示信息
    loadMore:{
      text: "上拉加载更多",
      show: false
    }
  },
  onLoad: function (options) {
    this.initData()
  },
  onReachBottom: function () {
    this.data.loadMore.show= true
    this.data.loadMore.show= "正在加载..."
    this.setData({ loadMore: this.data.loadMore})
    this.pageList()
  },
  // 初始化页面
  initData() {
    // 从代码表中搜索列表数据
  	app.$kwz.loadDms("DM_DD_DXLX", dms => {
      this.data.searchCondition.DM_DD_DXLX = app.$kwz.copyJson(dms.DM_DD_DXLX) || []
      // 给选项加“全部”。其实就是显示全部，实际为空值，后台判断空为全部
      this.data.searchCondition.DM_DD_DXLX.unshift({
        DMMX_CODE:"",DMMX_MC:"全部"
      })
      this.setData({searchCondition: this.data.searchCondition })
  	})
  	this.pageList(true)
  },
  // 加载列表 type=>true（覆盖式）/false（增量式）
  pageList(type) {
    if (type) {
      this.data.pageParam.page = 1
    }
    app.$kwz.ajax.ajaxUrl({
      url: '/dd_dxgl/doPageList',
      type: 'POST',
      page: this,
      data: {
        "U_USERID":this.data.pageParam.keyword, //账号 
        "P_ORG_ID_MC":"", //查找指定下级机构名称 周雄=暂时不传
        "DH":this.data.pageParam.DH, //电话 
        "BH":this.data.pageParam.BH, //编号 
        "P_ORG_ID":"", ///查找指定下级机构代码 周雄=暂时不传
        "DXLXM":this.data.pageParam.DXLXM, //督学类型码
        "YXZT":this.data.pageParam.YXZT, //状态 （三种状态：1、在岗 0、已删除 3、离职/离岗） 
        "XM":this.data.pageParam.XM, //姓名 
        "page":this.data.pageParam.page
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
  // 修改 电话 姓名 编号
  inputXm({detail}){
    this.data.pageParam.XM = detail.value
    this.setData({ pageParam: this.data.pageParam})
  },
  inputDh({detail}){
    this.data.pageParam.DH = detail.value
    this.setData({ pageParam: this.data.pageParam})
  },
  inputBh({detail}){
    this.data.pageParam.BH = detail.value
    this.setData({ pageParam: this.data.pageParam})
  },
  // 选择 督学类型 状态
  changeDxlx(e) {
    let checkedOption = this.data.searchCondition.DM_DD_DXLX[e.detail.value]
    this.data.pageParam.DXLXM = checkedOption.DMMX_CODE
    this.data.pageParam.DXLX = checkedOption.DMMX_MC
    this.setData({
      pageParam: this.data.pageParam
    })
  },
  changeZt(e) {
    let checkedOption = this.data.searchCondition.YXZTList[e.detail.value]
    this.data.pageParam.YXZT = checkedOption.DMMX_CODE
    this.data.pageParam.YXZTMC = checkedOption.DMMX_MC
    this.setData({
      pageParam: this.data.pageParam
    })
  },
  // 搜素列表
  searchList({detail}) {
    console.log(this.data.pageParam)
    this.data.pageParam.keyword = detail.value
    this.pageList(true)
  },
  // 去预览
  toPreview({currentTarget}) {
    let id = currentTarget.dataset.id
    if (id) {
      wx.navigateTo({ url: '/pages/dxgl/dxgl-preview/dxgl-preview?id=' + id})
    }
  },
})