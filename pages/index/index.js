//index.js

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
    extraIcon: {type: 'kw-circle', color: '#00bdfd', size: '20' },
    // 整个新闻列表数据
    newsBtList:[
      [],
      [],
    ]
  },
  // 更改标题栏选中值
  changeBt(e){
    this.setData({
      isActive: e.currentTarget.dataset.index,
    });
  }
})
