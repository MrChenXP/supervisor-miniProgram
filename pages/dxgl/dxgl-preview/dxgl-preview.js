const app = getApp()
Page({
  data: {
    // 个人简介显示隐藏
    jjShow:true,
    id:"",
    data: {
    	IMAGE: '../../static/images/DefaultImg.png',
    },
  },
  onLoad: function (query) {
    this.data.id = query.id
    this.loadData()
  },
  loadData(){
    app.$kwz.ajax.ajaxUrl({
      url: 'dd_dxgl/selectByPrimaryKey',
      type: 'POST',
      data: {
        DXID: this.data.id
      },
      page: this,
      then (response) {
        let data= response.datas.data
        if(data.IMAGE){
          let _this = this
          app.$kwz.cacheAttach({
            url: 'jc_file/doDownload?F_ID=' + data.IMAGE,
            success({tempFilePath}){
              data.IMAGE = tempFilePath
              _this.setData({data})
              console.log(_this.data.data)
            }
          })
        } else{
          this.data.data.IMAGE = "/static/images/DefaultImg.png"
          this.setData({data})
        }
      }
    })
  }
})