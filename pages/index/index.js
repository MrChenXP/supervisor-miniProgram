//index.js
const app = getApp()
Page({
  data: {
    // 轮播图图片路径
    newsImaUrl: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640'

      ],
    // 标题栏文字
    btList: ["现场督导", "现场督导", "现场督导", "现场督导", "现场督导", "现场督导"],
    // 控制标题栏选中样式
    isActive: 2,
    // 左侧图标属性值
    extraIcon: {type: 'kw-circle', color: '#00bdfd', size: '16' },
    // 整个新闻列表数据
    newsBtList:[
      [],
      [],
    ]
  },
  onLoad(){
    this.loadIndexData()
  },
  // 更改标题栏选中值
  changeBt(e){
    this.setData({
      isActive: e.currentTarget.dataset.index,
    });
  },
  // 加载首页数据
	loadIndexData() {
    // app.$kwz.ajax.ajaxUrl({
    //   url: 'jc_mobile/open/getYkXtsz',
    //   type: 'POST',
    //   vue: this,
    //   then(data) {
    //     console.log(data)
    //   }
    // })  
  }
})
