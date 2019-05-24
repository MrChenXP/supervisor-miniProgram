//index.js
const app = getApp()
Page({
  data: {
    // 轮播图图片路径
    newsImaUrl: [],
    // 标题栏文字
    btList: [],
    // 控制标题栏选中样式
    isActive: 2,
    // 左侧图标属性值
    extraIcon: {type: 'kw-circle', color: '#00bdfd', size: '16' },
    // 整个新闻列表数据
    newsBtList: [
      [],
      [],
    ]
  },
  // onLoad事件 [微信文档](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onloadobject-query)
  onLoad() {
    this.loadIndexData()
  },
  // 加载首页数据
  loadIndexData() {
    let that = this
    app.$kwz.ajax.ajaxUrl({
      url: '/jc_mobile/open/getYkXtsz',
      type: 'POST',
      page: this,
      success (data) {
        if (data && '200' == data.statusCode) {
          let ykpic = data.datas.YKPIC
          let ykinfo = data.datas.YKINFO;
          // 首页图片
          if (ykpic && ykpic.length > 0) {
            for(let i =0;i<ykpic.length;i++) {
              app.$kwz.cacheAttach({
                url: '/index/visit/doDownload?F_ID=' + ykpic[i].F_ID,
                page: this,
                success (filepath) {
                  if (filepath.statusCode === 200) {
                    let newsImaUrl = this.data.newsImaUrl
                    newsImaUrl.push(filepath.tempFilePath)
                    this.setData({newsImaUrl})
                  }
                }
              })
            }
          }
          // 首页新闻
          if (ykinfo && ykinfo.length > 0) {
            for (let i = 0; i < ykinfo.length; i++) {
              this.data.btList.push(ykinfo[i].YWMC)
              this.data.newsBtList.push(ykinfo[i].CONTENT)
            }
          }
          // 因组织架构图并不能从后端配出来，顾前端手动添加
          this.data.btList.push("组织架构图")
          this.data.newsBtList.push([{
            TITLE: "组织架构图",
            CONTENT_ID: "组织架构图"
          }])
          this.setData({
            btList: this.data.btList,
            newsBtList: this.data.newsBtList
          })
          console.log(this.data.newsBtList)
        }
      }
    })
  },
  // 更改标题栏选中值
  changeBt(e) {
    this.setData({
      isActive: e.currentTarget.dataset.index,
    });
  }
})
