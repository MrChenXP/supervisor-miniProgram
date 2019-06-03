// dist/kw-ui/kw-gzjh-select/kw-gzjh-select.js
Component({
  options: {
    styleIsolation: "apply-shared" // 表示页面wxss样式将影响到自定义组件，但自定义组件wxss中指定的样式不会影响页面
  },
  externalClasses: ['kw-class'],  // 接受外部传入的样式类
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击蒙版(取消用的)
    close(){
      this.triggerEvent('close')
    }
  }
})
