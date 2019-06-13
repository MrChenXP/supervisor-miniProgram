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
    value: {
      type: String,
      value: ""
    },
  },
  methods: {
    // 富文本初始化
    onEditorReady(){
      const that = this
      this.createSelectorQuery().select('#kw-editor').context(function (res) {
        that.editorCtx = res.context // 讲富文本编辑器对象化到this下
        that.editorCtx.setContents({
          html: that.data.value
        })
      }).exec()
    },
    // 富文本输入
    input(e){
      this.editorCtx.action.args.html = e.detail.html
      this.triggerEvent("input")
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
