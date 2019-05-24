Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
    styleIsolation: "apply-shared" // 表示页面wxss样式将影响到自定义组件，但自定义组件wxss中指定的样式不会影响页面
  },
  externalClasses: ['kw-class'],  // 接受外部传入的样式类
  data:{
    isKwIcon: false
  },
  properties: {
    // 标题
    title: String,
    // 描述
    note: String,
    // 左侧扩展图标 与左侧缩略图互斥
    extraIcon: Object,
    // 左侧缩略图
    thumb: String,
    // 右侧描述文字
    rightNote: String,
    // 右侧小红点
    redDot: {
      type: Boolean,
      value: false
    },
    // 右侧灰箭头
    isArrow: {
      type: Boolean,
      value: true
    },
    // 上边框
    borderTop: {
      type: Boolean,
      value: false,
    },
    // 下边框
    borderBottom: {
      type: Boolean,
      value: true,
    },
    // 链接
    link: String,
  },
  ready(){
    // 判断是否属于kw的icon
    let kwReg = /^(kw)/g
    if (this.data.extraIcon != null){
      this.setData(
        { isKwIcon: kwReg.test(this.data.extraIcon.type) }
      )
    }
    
  },
  methods:{
    // 返回一个点击事件 如果有link属性则会跳转对应链接
    goLink(){
      if (this.data.link) {
        wx.navigateTo({
          url: this.data.link
        });
      }
      this.triggerEvent('click')
    }
  }
})