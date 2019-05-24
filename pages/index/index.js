//index.js

const app = getApp()

Page({
  data: {
    // 轮播图图片路径
    newsImaUrl: [],
    // 标题栏文字
    btList: ["现场督导", "现场督导", "现场督导", "现场督导", "现场督导", "现场督导"],
    // 控制标题栏选中样式
    isActive: 2,
    // 左侧图标属性值
    extraIcon: {type: 'kw-circle', color: '#00bdfd', size: '20' },
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
      success (data) {
        if (data && '200' == data.statusCode) {
          let ykpic = data.datas.YKPIC
          // 首页图片
          if (ykpic && ykpic.length > 0) {
            for(let i =0;i<ykpic.length;i++) {
              app.$kwz.cacheAttach({
                url: '/index/visit/doDownload?F_ID=' + ykpic[i].F_ID,
                success (filepath) {
                  if (filepath.statusCode === 200) {
                    let newsImaUrl = that.data.newsImaUrl
                    newsImaUrl.push(filepath.tempFilePath)
                    that.setData({newsImaUrl})
                  }
                }
              })
            }
          }
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
