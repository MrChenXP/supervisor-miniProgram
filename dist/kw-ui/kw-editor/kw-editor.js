// dist/kw-ui/kw-editor/kw-editor.js
Component({
  properties: {
    // 提示信息
    placeholder:{
      type: String,
      value: "请输入"
    },
    // 初始化内容
    value: {
      type: String,
      value: "<p>这是给你放初始化内容的</p>"
    },
  },
  data: {
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
    },
    // 插入图片
    insertImage(){
      const that = this
      wx.chooseImage({
        count: 1,
        sizeType: "compressed",
        success(e){
          that.editorCtx.insertImage({
            src: e.tempFilePaths[0],
            success: function () {
              console.log('插入成功')
            }
          })
        }
      }) 
    }
  }
})
