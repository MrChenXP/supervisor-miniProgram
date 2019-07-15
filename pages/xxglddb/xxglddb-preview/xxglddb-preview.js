const app = getApp()
Page({
  data: {
    // 基本信息和年度属性切换
    xxsxShow: true,
    // 基本信息-上级机构显示隐藏
    sjjgShow: true,
    // 基本信息-简介显示隐藏
    jjShow: true,
    // 基本信息-办学条件显示隐藏
    bxtjShow: true,
    // 基本信息-学生显示隐藏
    xsShow: true,
    // 基本信息-教职工显示隐藏
    jzgShow:true,
    // 基本信息-骨干教师显示隐藏
    ggjsShow:true,
    // 基本信息-学历分布显示隐藏
    xlfbShow:true,
    // 基本信息-职称分布显示隐藏
    zcfbShow:true,
    // 基本信息-年龄结构显示隐藏
    nljgShow:true,
    // 学校id
    id:"",
    // 基本信息
    jbxxData:{},
    // 学年属性数据
    ndsxData:{},
    // 学年属性数据-学年下拉数据
    xnList:[],
    // 学年属性数据-当前学年
    xnValue:"",
  },
  onLoad(query) {
    this.data.id = query.id
    this.loadData()
  },
  // 预先加载数据
  loadData() {
    this.getJbxxData()
    this.getXnList()
    this.getXnValue()
  },
  // 基本信息数据获取
  getJbxxData(){
    app.$kwz.ajax.ajaxUrl({
      url: 'dd_xx/doSelectByPrimaryKey',
      type: 'POST',
      data: {
        ORG_ID: this.data.id
      },
      page: this,
      then (response) {
        let jbxxData = response.datas
        this.setData({jbxxData})
      }
    })
  },
  // 学年属性-学年下拉数据获取
  getXnList(){
    app.$kwz.ajax.ajaxUrl({
      url: 'jc_xq/doList',
      type: 'POST',
      page: this,
      then (response) {
        let xnList = app.$kwz.uniq(response.datas)
        this.setData({xnList})

      }
    })
  },
  // 学年属性-获取当前学年
  getXnValue(){
    app.$kwz.ajax.ajaxUrl({
      url: 'jc_xq/getCurXq',
      type: 'POST',
      page: this,
      then (response) {
        let xnValue = response.datas.curXq.XQ_ND
        this.setData({xnValue})
        this.getNdsxData()
      }
    })
  },
  // 年度属性-获取数据
  getNdsxData(){
    app.$kwz.ajax.ajaxUrl({
      url: 'dd_xx/doSelectNdsx',
      type: 'POST',
      data: {
        ORG_ID: this.data.id,
        XQ_ND: this.data.xnValue
      },
      page: this,
      then (response) {
        let ndsxData = response.datas
        this.setData({ndsxData})
      }
    })
  },
  // 分页显示隐藏
  pageShow(){
    this.setData({xxsxShow: !this.data.xxsxShow})
  },
  // 选择搜索条件 => 学段
  changeXn(e) {
    let checkedOption = this.data.xnList[e.detail.value]
    this.setData({ 
      xnValue: checkedOption.XQ_ND
    })
    this.getNdsxData()
  },
})