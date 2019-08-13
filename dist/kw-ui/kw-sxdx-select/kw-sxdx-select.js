// dist/kw-ui/kw-gzjh-select/kw-gzjh-select.js
const app = getApp()

Component({
    options: {
        styleIsolation: "apply-shared" // 表示页面wxss样式将影响到自定义组件，但自定义组件wxss中指定的样式不会影响页面
    },
    externalClasses: ['kw-class'], // 接受外部传入的样式类
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
    },
    ready() {
        this.loadSxdx(true)
    },
    methods: {
        // 数据列表 type => true(全新)/false(增量)
        loadSxdx(type) {
            this.data.page = type == true ? 1 : this.data.page
            app.$kwz.ajax.ajaxUrl({
                url: '/jc_group/doDdChoose',
                type: 'POST',
                data: {
                    DDJL: 'DDJL',
                    page: this.data.page,
                    DXLXM: '',
                    U_USERNAME: this.data.searchKeyword,
                    ORG_MC: '',
                    EXCEPT: '3'
                },
                page: this,
                success(data) {
                    let datas = data.datas
                    console.log(data)
                    this.data.page++
                        if (datas && datas.length > 0) {
                            let loadDataList = []
                            for (let i = 0; i < datas.length; i++) {
                                loadDataList.push({
                                    value: datas[i].U_ID,
                                    name: datas[i].U_USERNAME,
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
        close() {
            this.triggerEvent('close')
        },
        // 关键字输入
        keywordConfirm(e) {
            this.data.searchKeyword = e.detail.value
            this.loadSxdx(true)
        },
        // 选择时进行改变
        radioChange(e) {
            this.data.checkRadio = e.detail.value;
        },
        // 从list中取出对象
        getRadioValue(ids) {
            let datas = []
            if (this.data.loadDataList.length > 0) {
                for (let j = 0; j < ids.length; j++) {
                    for (let i = 0; i < this.data.loadDataList.length; i++) {
                        if (ids[j] == this.data.loadDataList[i].value) {
                            datas.push(this.data.loadDataList[i])
                            break
                        }
                    }
                }
            }
            return datas
        },
        // 点击确定
        confirm() {
            this.triggerEvent("confirm", {
                data: this.getRadioValue(this.data.checkRadio),
            })
        },
        // 阻止滑动穿透
        catchtouchmove() {},
    }
})