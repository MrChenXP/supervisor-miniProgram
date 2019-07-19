const app = getApp()
Page({
  data: {
    // 过程记录显示隐藏
    gcjlShow:false,
    // 综合评价显示隐藏
    zhpjShow:false,
    // 表单数据
    data: {
      MXID: ''
    },
    tbmbglData: {}, // 老记录模板数据
    ddjs: [],
    isNew: "1"
  },
  onLoad(query) {
    this.data.data.MXID = query.id
    this.data.isNew = query.isNew
    if (this.data.isNew !== "1") {
      // this.initPage()
      this.data.tbmbglData.MBNR="因系统升级，此记录请于电脑端查看"
    }else{
      this.initPage()
    }
  },
  // 初始化页面
  initPage () {
    if (this.data.data.MXID) {
      app.$kwz.ajax.ajaxUrl({
        url: 'jc_pgbzmx/doSelectByPrimary/TKJL',
        type: 'POST',
        data: {
          MXID: this.data.data.MXID
        },
        page: this,
        then (response) {
          let data = response.datas
          let date = new Date(data.YWSJ.replace(/-/g, '/'))
          data.YWSJ = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日 '
          data.SJ = JSON.parse(data.SJ)
          data.GCJL = app.$kwz.formatImg(data.GCJL)
          this.setData({data})
        }
      })
    }
  },
  //打开关闭 过程记录 综合评价
  changeGcjlShow(){
    this.setData({ gcjlShow: !this.data.gcjlShow })
  },
  changeZhpjShow(){
    this.setData({ zhpjShow: !this.data.zhpjShow })
  },
})