// dist/kw-ui/kw-gzjh-select/kw-gzjh-select.js
const app = getApp()

Component({
    options: {
        styleIsolation: "apply-shared" // 表示页面wxss样式将影响到自定义组件，但自定义组件wxss中指定的样式不会影响页面
    },
    externalClasses: ['kw-class'], // 接受外部传入的样式类
    properties: {
        // 控制显示隐藏
        hidden: Boolean,
        // 维度
        latitude: String,
        // // 经度
        longitude: String
    },
    data: {
        // 修改框 显示隐藏
        xgShow: false,
        // 搜索学校用的关键字
        ORG_MC: "",
        page: 1,
        // 学校列表
        loadDataList: [],
        // 选择的学校数据
        xxData:{},
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
                url: 'jc_org/doPageList',
                type: 'POST',
                data: {
                    page: this.data.page,
                    ORG_MC: this.data.ORG_MC,
                    ORG_DJ: 80
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
        // 更改学校位置信息
        changeShoolPosition(){
            app.$kwz.ajax.ajaxUrl({
                url: 'dd/dd_xx/doUpdateJwdByOrgId',
                type: 'POST',
                data: {
                    orgId: this.data.xxData.value,
                    xxjd: this.data.longitude,
                    xxwd: this.data.latitude,
                },
                page: this,
                success(data) {
                    app.$kwz.alert(data.msg)
                }
            })
            this.triggerEvent("confirm")
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
            this.data.xxData=this.getRadioValue(this.data.checkRadio)
            let _this = this
            wx.showModal({
                title: '确定吗?',
                content: '修正后将会更改此学校位置信息！',
                success(res) {
                    if (res.confirm) {
                        _this.changeShoolPosition()
                    } else if (res.cancel) {
                        _this.triggerEvent("close")
                    }
                }
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
        // 阻止滑动穿透
        catchtouchmove() { },
    }
})