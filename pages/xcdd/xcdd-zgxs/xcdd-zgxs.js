const app = getApp()
Page({
  data: {
    // 整改协商id
    zgxsId: '',
    // 整改协商状态
    status: "",
    // 页面数据
    data:{},
    // 处理加过显示隐藏
    cljgShow: false,
    // 处理结果整个列表是否显示
    cljgCellShow: false,
    
  },
  onLoad: function (param) {
    if (param && param.zgxsId) {
      this.data.zgxsId = param.zgxsId
      this.setData({ status: param.status })
      this.initData()
    }
  },
  // 初始化页面
  initData() {
    app.$kwz.ajax.ajaxUrl({
      url: '/dd_zgxs/doSelectByPrimary',
      type: 'POST',
      data: {
        ZGXSID: this.data.zgxsId
      },
      page: this,
      then(response) {
        let datas = response.datas
        datas.CLBG = app.$kwz.formatImg(datas.CLBG)
        if (datas && datas.ZGXSID) {
          datas.YWSJ = datas.YWSJ.length > 10 ? datas.YWSJ.substr(0, 10) : datas.YWSJ
          this.setData({ data: datas})
          if (datas.CLZTDM >= 24 || (datas.CLZTDM >= 4 && datas.CLZTDM <= 6) ) {
            this.setData({
              cljgCellShow: true
            })
          }
        }
      }
    })
  },
  // 处理结果显示隐藏 
  cljgShow(){
    this.setData({ cljgShow: !this.data.cljgShow})
  }
})