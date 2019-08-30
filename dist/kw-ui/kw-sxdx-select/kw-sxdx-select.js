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
        // 查看已选 显示隐藏
        ckyxShow: false,
        // 搜索学校用的关键字
        searchKeyword: "",
        // 是否只查下级
        flag: true,
        page: 1,
        // 以选择督学id
        USERS:"",
        // 督学列表
        loadDataList: [],
        // 已选督学列表
        yxList:[],
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
                    USERS: this.data.USERS,
                    U_USERNAME: this.data.searchKeyword,
                    EXCEPT: '3',
                    flag: this.data.flag ? 1 : 0,
                },
                page: this,
                success(data) {
                    let datas = data.datas
                    this.data.page++
                        if (datas && datas.length > 0) {
                            let loadDataList = []
                            for (let i = 0; i < datas.length; i++) {
                                loadDataList.push({
                                    value: datas[i].U_ID,
                                    name: datas[i].U_USERNAME,
                                    data: datas[i],
                                    checked: false,
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
            this.data.checkRadio = e.detail.value
            let type = e.target.dataset.type
            if(type){
                this.deleteRadioValue(this.data.checkRadio)
            }else{
                this.getRadioValue(this.data.checkRadio)
            }
            this.loadSxdx(true)
        },
        // 从list中取出对象 并赋值已选择随行督学
        getRadioValue(ids) {
            let yxList = this.data.yxList
            let USERS = this.data.USERS
            if (this.data.loadDataList.length > 0) {
                for (let j = 0; j < ids.length; j++) {
                    for (let i = 0; i < this.data.loadDataList.length; i++) {
                        if (ids[j] == this.data.loadDataList[i].value) {
                            USERS += ids[j] + ','
                            yxList.push({
                                value: this.data.loadDataList[i].value,
                                name: this.data.loadDataList[i].name,
                                data: this.data.loadDataList[i].data,
                                checked: true,
                            })
                            break
                        }
                    }
                }
            }
            this.setData({yxList,USERS})
        },
        // 删除已选
        deleteRadioValue(ids){
            let yxList = []
            let USERS = []
            for (let j = 0; j < ids.length; j++) {
                for (let i = 0; i < this.data.yxList.length; i++) {
                    if (ids[j] == this.data.yxList[i].value) {
                        yxList.push(this.data.yxList[i])
                        USERS += ids[j] + ','
                        break
                    }
                }
            }
            this.setData({ yxList, USERS })
        },
        // 查看已选
        ckyxShow(){
            this.setData({
                ckyxShow: !this.data.ckyxShow
            })
        },
        // 点击确定
        confirm() {
            this.triggerEvent("confirm", {
                data: this.data.yxList,
            })
        },
        // 选择搜索条件 查看下级
        changeZcxj(e) {
            this.setData({
               flag: !this.data.flag
            })
            this.loadSxdx(true)
        },
        // 阻止滑动穿透
        catchtouchmove() {},
    }
})
