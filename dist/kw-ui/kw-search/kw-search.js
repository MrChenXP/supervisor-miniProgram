// dist/kw-ui/kw-search/kw-search.js
Component({
  options:{
    styleIsolation: "apply-shared" // 表示页面wxss样式将影响到自定义组件，但自定义组件wxss中指定的样式不会影响页面
  },
  externalClasses: ['kw-class'],  // 接受外部传入的样式类
  properties: {
    value: { // 搜索框值
      value: '',
      type: String
    },
    placeholder: { // 搜索框占位符
      type: String,
      value: "请输入"
    },
    // 是否要输入框
    isInput: {
      type: Boolean,
      value: true
    }
  },
  data: {
    ifFocus: false,// 是否点击输入框
    inputShow: true
  },
  methods: {
    //点击输入框
    tapFocus() {
      this.setData({
        ifFocus: true,
      })
      if (!this.data.isInput) {
        this.setData({
          inputShow: false
        })
      }
    },
    // 输入搜索时改变量
    inputChange(e) {
      this.setData({
        value: e.target.value
      })
    },
    // 取消
    cancel() {
      this.setData({
        ifFocus: false,
        inputShow: true
      })
      this.triggerEvent("cancel")
    },
    // 确定 callback:输入框输入内容
    confirm() {
      this.setData({
        ifFocus: false,
        inputShow: true
      })
      this.triggerEvent("confirm", {
        value: this.data.value
      })
    }
  }
})
