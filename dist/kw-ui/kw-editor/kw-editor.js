const app = getApp()
// dist/kw-ui/kw-editor/kw-editor.js
Component({
  options:{
    styleIsolation: "apply-shared" // 表示页面wxss样式将影响到自定义组件，但自定义组件wxss中指定的样式不会影响页面
  },
  externalClasses: ['kw-class'],  // 接受外部传入的样式类
  properties: {
    // 提示信息
    placeholder:{
      type: String,
      value: "请输入"
    },
    // 初始化内容
    value: String    
  },
  observers:{
    value(){
      const that = this
      // 请求是异步的，初始化的时候可能没有值，固不能用editor初始化属性
      if(this.data.value){
        this.createSelectorQuery().select('#kw-editor').context(function (res) {
          that.editorCtx = res.context
          let html = app.$kwz.formatImg(that.data.value)
          that.editorCtx.setContents({
            html: html
          })
        }).exec()
      }
    }
  },
  ready(){
  },
  methods: {
    // 富文本初始化 暂时隐藏 因为监听了value值的变化，每次变化都初始化了
    onEditorReady(){
      const that = this
      this.createSelectorQuery().select('#kw-editor').context(function (res) {
        that.editorCtx = res.context // 讲富文本编辑器对象化到this下
        let html = app.$kwz.formatImg(that.data.value)
        that.editorCtx.setContents({
          html: html
        })
      }).exec()
    },
    // 富文本输入 并将html返回给父组件 输入使用setData会导致焦点失去
    input({ detail }){
      this.triggerEvent("input",{
        data: detail.html
      })
    },
    // 插入图片
    insertImage(){
      // 调取相册和相机(封装了wx调取和kwz的上传)
      app.$kwz.uploadImg({
        page: this,
        success (file) {
          this.editorCtx.insertImage({ src: file.uri})
        }
      })
    }
  }
})
