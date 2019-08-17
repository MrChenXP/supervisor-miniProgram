Component({
// 教程 https://blog.csdn.net/yingleiming/article/details/82691032
// kw-circle 实心小圆点
// kw-zan 赞
// kw-cai 踩
  externalClasses: ['kw-class'],
  properties: {
    type: {
      type: String,
      value: ''
    },
    custom: {
      type: String,
      value: ''
    },
    size: {
      type: Number,
      value: 14
    },
    color: {
      type: String,
      value: ''
    }
  },
  ready() {
  },
});
