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
        ORG_MC: "",
        // 搜索参数
        searchCondition: {
            // 是否只查下级
            isZcxj: [{
                DMMX_CODE: "0", DMMX_MC: "否"
            }, {
                DMMX_CODE: "1", DMMX_MC: "是"
            }],
        },
        // 搜索以及分页参数
        pageParam: {
            isZcxj: '是',
            isZcxjFlag: "1"
        },
        page: 1,
        // 学校列表
        loadDataList: [],
        // 加载提示文字
        moreName: true,
    },
    ready() {
        this.loadSchool(true)
    },
    methods: {
        // 加载学校 type => true(全新)/false(增量)
        loadSchool(type) {
            this.data.page = type == true ? 1 : this.data.page
            app.$kwz.ajax.ajaxUrl({
                url: '/dd_gzap/getSchoolPage',
                type: 'POST',
                data: {
                    DDJL: '',
                    page: this.data.page,
                    ORG_MC: this.data.ORG_MC,
                    flag: this.data.pageParam.isZcxjFlag
                },
                page: this,
                success(data) {
                    let datas = data.datas
                    this.data.page++
                        if (datas && datas.length > 0) {
                            let loadDataList = []
                            let xxList = datas
                            for (let i = 0; i < xxList.length; i++) {
                                loadDataList.push({
                                    value: xxList[i].ORG_ID,
                                    name: xxList[i].ORG_MC,
                                    data: xxList[i]
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
            this.data.ORG_MC = e.detail.value
            this.loadSchool(true)
        },
        // 选择时进行改变
        radioChange(e) {
            this.data.checkRadio = e.detail.value;
            this.triggerEvent("confirm", {
                data: this.getRadioValue(this.data.checkRadio)
            })
        },
        // 从list中取出对象
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
        // 选择搜索条件 查看下级
        changeZcxj(e) {
            let checkedOption = this.data.searchCondition.isZcxj[e.detail.value]
            this.data.pageParam.isZcxjFlag = checkedOption.DMMX_CODE
            this.data.pageParam.isZcxj = checkedOption.DMMX_MC
            this.setData({
                pageParam: this.data.pageParam
            })
        },
        // 阻止滑动穿透
        catchtouchmove() {},
    }
})