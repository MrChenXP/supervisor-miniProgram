// pages/news/news.js
const app = getApp()
Page({
  data: {
    contentId: "",
    news: {},
    newsContent: [
      {
        content: '',
        image: false,
        imageUrl: ''
      }
    ]
  },

  onLoad: function (params) {
    if (params && params.CONTENT_ID) {
      this.setData({
        contentId: params.CONTENT_ID
      })
      this.loadNews();
    }
  },
  loadNews(){
    app.$kwz.ajax.ajaxUrl({
      url: '/jc_mobile/open/getContent',
      type: 'POST',
      page: this,
      data: {
        CONTENTID: this.data.contentId
      },
      then(data) {
        
        this.data.news = data.datas
        this.data.news.LY = this.data.news.LY || '本站原创'
        // 若new.TXT为null rict-text组件会报错
        if (!this.data.news.TXT) {
          this.data.news.TXT = "<p>暂无数据，请联系管理员</p>"
        }
        this.setData({
          news: this.data.news
        })
      }
    })
  }
})