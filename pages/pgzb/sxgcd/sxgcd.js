// 树形观测点
Component({
    options: {
        multipleSlots: true, // 在组件定义时的选项中启用多slot支持
        styleIsolation: "apply-shared" // 表示页面wxss样式将影响到自定义组件，但自定义组件wxss中指定的样式不会影响页面
    },
    externalClasses: ['kw-class'],  // 接受外部传入的样式类
    properties: {
        // 菜单数据
        value: Object,
        // 评估id
        pgId:String,
        // 评估类型
        type: String,
        // 给评估情况用的值
        evaluationType: String,
        evaluationOrgId: String,
        isReport: String,
        name: String,
        nbId: String,
    },
    data: {

    },
    lifetimes:{
        ready(){
        },
    },
    methods: {
        // 去评估填报
        toPgtb(e){
            let item = e.currentTarget.dataset.item
            if (!item.parentid || item.children.length == 0){ // 没有父id 或者没有子
          let url = `pgId=${this.data.pgId}&pId=${item.pId}&type=${this.data.type}&evaluationType=${this.data.evaluationType}&evaluationOrgId=${this.data.evaluationOrgId}&isReport=${this.data.isReport}&name=${this.data.name}&nbId=${this.data.nbId}`
                wx.navigateTo({
                    url: `/pages/pgzb/pgtb/pgtb?` + url
                })
            }
        }
    }
})