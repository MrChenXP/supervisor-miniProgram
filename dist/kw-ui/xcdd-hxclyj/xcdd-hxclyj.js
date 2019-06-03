// dist/kw-ui/xcdd-hxclyj/xcdd-hxclyj.js
Component({
  properties: {

  },
  data: {

  },
  methods: {
    // 点击取消用的
    close(){
      this.triggerEvent('close')
    },
    // 点击确定
    confirm(){
      this.triggerEvent('confirm')
    }
  }
})
