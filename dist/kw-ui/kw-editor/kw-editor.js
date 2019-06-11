const app = getApp()
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
      // this.editorCtx.setContents({
      //   text: e.detail.html
      // })
      this.editorCtx.action.args.html = e.detail.html
      console.log(this.editorCtx.action.args.html )
      console.log(e.detail.html)
    },
    // 插入图片
    insertImage(){
      app.$kwz.uploadImg({
        success (file) {
          console.log(this)
          this.editorCtx.insertImage({
            src: file.uri,
            data: {
              id: 'abcd',
              role: 'god'
            },
            success: function () {
              console.log('insert image success')
            }
          })
        },
        error (error) {
          // 错误回调
        },
        page: this
      })
      // const that = this
      // wx.chooseImage({
      //   count: 1,
      //   sizeType: "compressed",
      //   success(e){
      //     if (e.tempFilePaths && e.tempFilePaths.length > 0) {
      //       app.$kwz.uploadImg(e.tempFilePaths[0], null, (response) => {
      //         console.log(response)
      //       })
      //     }
          // app.$kwz.uploadImg()
          // that.editorCtx.insertImage({
          //   src: e.tempFilePaths[0],
          //   data: {
          //     id: 'abcd',
          //     role: 'god'
          //   },
          //   success: function () {
          //     console.log('insert image success')
          //   }
          // })
      //   }
      // }) 
    }
  }
})
