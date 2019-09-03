// dist/kw-ui/kw-gzjh-select/kw-gzjh-select.js
const app = getApp()
Component({
  options: {
    styleIsolation: "apply-shared" // 表示页面wxss样式将影响到自定义组件，但自定义组件wxss中指定的样式不会影响页面
  },
  externalClasses: ['kw-class'],  // 接受外部传入的样式类
  properties: {
    // 默认选中的值 多选所以要传数组
    checkRadio: {
      type: [Object, Array, String],
      value: []
    },
    // 控制显示隐藏
    hidden: Boolean
  },
  data: {
    // 搜索学校用的关键字
    searchKeyword: "",
    page: 1,
    // 学校列表
    loadDataList: [],
    // 加载提示文字
    moreName: true,
    // checkRadioA: this.data.checkRadio
  },
  ready() {
    this.loadGzjh(true)
  },
  methods: {
    // 加载工作计划 type => true(全新)/false(增量)
    loadGzjh(type) {
      this.data.page = type == true ? 1 : this.data.page
      app.$kwz.ajax.ajaxUrl({
        url: '/dd_gzap/doList/DDGZAP_GP',
        type: 'POST',
        data: {
          page: this.data.page,
          SEARCH_TEXT: this.data.searchKeyword
        },
        page: this,
        success(data) {
          let datas = data.datas
          this.data.page++
          if (datas && datas.length > 0) {
            let loadDataList = []
            for (let i = 0; i < datas.length; i++) {
              loadDataList.push({
                value: datas[i].CONTENT_ID,
                name: `${datas[i].XXMC}/${datas[i].YWSJ}/${datas[i].SD === '1' ? '上午' : '下午'}/${datas[i].AUTHOR}`,
                data: datas[i]
              })
            }
            if (type == true) {
              this.data.loadDataList = loadDataList
            } else {
              this.data.loadDataList = this.data.loadDataList.concat(loadDataList)
            }
            this.data.moreName = true
          } else {
            this.data.moreName = false
            this.data.loadDataList = type == true ? [] : this.data.loadDataList
          }
          this.setData({
            loadDataList: this.data.loadDataList,
            moreName: this.data.moreName
          })
        }
      })
    },
    // 点击蒙版(取消用的)
    close(){
      this.triggerEvent('close')
    },
    // 关键字输入
    keywordConfirm(e){
      this.data.searchKeyword = e.detail.value
      this.loadGzjh(true)
    },
    // 选择时进行改变
    radioChange(e) {
      this.data.checkRadio = e.detail.value;
      this.triggerEvent("confirm", {
        data: this.getRadioValue(this.data.checkRadio)
      })
    },
    // 从list中取出学校对象
    getRadioValue(id) {
      if (this.data.loadDataList.length > 0) {
        for (let i = 0; i < this.data.loadDataList.length; i++) {
          if (id == this.data.loadDataList[i].value) {
            return this.data.loadDataList[i]
          }
        }
      }
      return {}
    },
    // 阻止滑动穿透
    catchtouchmove(){},
  }
})
