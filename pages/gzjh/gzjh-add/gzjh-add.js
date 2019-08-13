const app = getApp()
Page({
    data: {
        // 学校显示隐藏
        schoolShow: true,
        // 随行督学显示隐藏
        sxdxShow: true,
        // 学校(校园)数据
        xx: {
            name: '',
            value: ''
        },
        // 表单数据
        formData: {
            xxName: '',
            xxId: '',
            YWSJ: '',
            sdValue: [],
            sxdxName: '',
            sxdxId: '',
            ddsxTxt: '',
            pgbzValue: [],
            remark: '',
            xqid: ''
        },
        startDate: '', // 可填写的最小时间,别放在date对象里,而且一定要事先创建好变量
        endDate: '', // 可填写的最大时间,别放在date对象里,而且一定要事先创建好变量
        // 业务时间
        ywsj: "",
        // 时段列表
        sdList: [],
        // 时段值
        sdValue: {
            name: '',
            value: '',
            index: 0
        },
        // 随行督学
        sxdx: {
            name: '',
            value: '',
            index: 0
        },
        // 评估标准名字列表 规定任务评价
        zbList: [{ CONTENT: '选择指标体系', PID: ''}],
        // 评估标准值
        zbValue: {
            CONTENT: '选择指标体系',
            PID: '',
            index: 0
        },
        // 批次id 后台取名为BZID
        BZID:"",
        // 督导事项显示隐藏
        ddsxShow: true,
        // 督导事项
        ddsx: {},
        // 当前学期id
        xqid: '',
        remark: '',
        // 登陆用户
        loginUser: {},
        // 工作计划id
        contentId: '',
        // 最大最小时间限制 保存用
        minDate: "",
        maxDate: "",
        // 评估 开始 结束 时间
        start_time: "",
        end_time: "",

    },
    onLoad(param) {
        this.getdateImpose()
        if (param && param.CONTENT_ID) {
            this.setData({ contentId: param.CONTENT_ID })
        } else {
            this.getXqid()
        }
        this.init()
    },
    // 获取日期限制
    getdateImpose() {
        app.$kwz.dateImpose('b892eba5fae9493189ac81a510bbbd73', (date) => {
            this.data.minDate = date.minDate
            this.data.maxDate = date.maxDate
            this.setData({
                startDate: app.$kwz.getLimdat(date.minDate),
                endDate: app.$kwz.getLimdat(date.maxDate),
            })
        })
    },
    // 加载当前学期id
    getXqid() {
        app.$kwz.ajax.ajaxUrl({
            url: '/jc_xq/getCurXq',
            type: 'POST',
            page: this,
            then(response) {
                let datas = response.datas
                if (datas && datas.curXq) {
                    this.data.xqid = datas.curXq.XQ_ID
                }
            }
        })
    },
    // 初始化页面
    init() {
        // 时段代码
        app.$kwz.loadDms('DM_SD', dms => {
            this.setData({sdList: app.$kwz.copyJson(dms.DM_SD) || {}})
            // 指标体系列表
            app.$kwz.ajax.ajaxUrl({
                url: 'dd_pgpc/doSelectPoint/DDGZAP',
                type: 'POST',
                data: {
                    'YWLX': 'DDGZAP',
                },
                page: this,
                then(response) {
                    let datas = response.datas
                    let zbList = this.data.zbList
                    if (datas && datas.length > 0) {
                        for (let i = 0; i < datas.length; i++) {
                            zbList.push({
                                CONTENT: datas[i].CONTENT,
                                PID: datas[i].PID
                            })
                        }
                    }
                    this.setData({zbList})
                }
            })
        })
        app.$kwz.getLoginUser((user) => {
            this.data.loginUser = user
            if (!this.data.contentId) {
                this.data.sxdx.name = user.name
                this.data.sxdx.value = user.uid
                this.setData({ sxdx: this.data.sxdx })
            }
        })
        if(this.data.contentId){
            this.loadData()
        }
    },
    // 加载工作安排 和 指标体系数据
    loadData() {
        app.$kwz.ajax.ajaxUrl({
            url: '/dd_gzap/doSelectByPrimary/DDGZAP',
            type: 'POST',   
            data: {
                CONTENT_ID: this.data.contentId
            },
            page: this,
            then(response) {
                let datas = response.datas
                if (datas && datas.map) {
                    let map = datas.map
                    this.data.xx.name = map.ORG_ID_TARGET_MC
                    this.data.xx.value = map.ORG_ID_TARGET
                    this.data.ywsj = (map.YWSJ && map.YWSJ.length > 10 ? map.YWSJ.substr(0, 10) : '')
                    this.data.sdValue.value = map.SD
                    for (let i = 0; i < this.data.sdList.length; i++) {
                        if (this.data.sdList[i].DMMX_CODE == map.SD) {
                            this.data.sdValue.name = this.data.sdList[i].DMMX_MC
                            this.data.sdValue.index = i
                        }
                    }
                    this.data.BZID = map.BZID
                    this.data.sxdx.name = map.JGID_MC
                    this.data.sxdx.value = map.JGID
                    this.data.formData.ddsxTxt = map.TXT
                    this.data.xqid = map.XQID
                    this.setData({
                        xx: this.data.xx,
                        ywsj: this.data.ywsj,
                        sdValue: this.data.sdValue,
                        sxdx: this.data.sxdx,
                        formData: this.data.formData,
                        xqid: this.data.xqid,
                        BZID: this.data.BZID
                    })
                }
            }
        })
        app.$kwz.ajax.ajaxUrl({
            url: 'dd_gzap/doselectContentByContentId/DDGZAP',
            type: 'POST',
            data: {
                CONTENT_ID: this.data.contentId
            },
            page: this,
            then(response) {
                let zbValue = response.datas.map
                this.setData({
                    zbValue,
                    start_time: zbValue.KSSJ,
                    end_time: zbValue.JSSJ
                })
            }
        })
    },
    // 保存提交工作计划
    saveGzjh() {
        if (!this.data.xx.value || !this.data.ywsj || !this.data.sdValue.value || !this.data.sxdx.value) {
            app.$kwz.alert('学校、时间、时段、随行督学为必填项')
            return
        }
        if (this.data.start_time > this.data.end_time){
            app.$kwz.alert('结束时间必须大于开始时间')
            return
        }
        if (this.data.contentId) {
            this.doUpdate()
        } else {
            this.doAdd()
        }
    },
    // 新增
    doAdd() {
        app.$kwz.ajax.ajaxUrl({
            url: '/dd_gzap/doAdd/DDGZAP',
            type: 'POST',
            data: {
                CONTENT_TYPE: 'DDGZAP',
                STATUS: '1',
                GROUP_ARR: `[{
                    "xxid": "${this.data.xx.value}",
                    "xxmc": "${this.data.xx.name}",
                    "jgid": "${this.data.sxdx.value}",
                    "jgmc": "${this.data.sxdx.name}",
                    "ywsj": "${this.data.ywsj}",
                    "sd": "${this.data.sdValue.value}",
                    "minDate": ${this.data.minDate},
                    "maxDate": ${this.data.maxDate}
                }]`,
                TXT: this.data.formData.ddsxTxt,
                REMARK: this.data.remark,
                PID: this.data.zbValue.PID,
                PNAME: this.data.zbValue.PID ? this.data.zbValue.CONTENT : "",
                ORG_ID: this.data.xx.value,
                XXMC0:this.data.xx.name,
                AUTHOR: this.data.loginUser.name,
                start_time: this.data.start_time, // 评估开始时间
                end_time: this.data.end_time // 评估结束时间
            },
            page: this,
            then(response) {
                wx.navigateTo({
                    url: '/pages/gzjh/gzjh'
                })
                app.$kwz.alert('保存成功')
            }
        })
    },
    // 修改
    doUpdate() {
        app.$kwz.ajax.ajaxUrl({
            url: '/dd_gzap/doUpdate',
            type: 'POST',
            data: {
                CONTENT_ID: this.data.contentId,
                ORG_ID: this.data.xx.value,
                // XXMC0: this.data.xx.name,
                JGID: this.data.sxdx.value,
                JGID_MC: this.data.sxdx.name,
                YWSJ: this.data.ywsj,
                SD: this.data.sdValue.value,
                TXT: this.data.formData.ddsxTxt,
                PID: this.data.zbValue.PID ? this.data.zbValue.PID : "",
                // PNAME: this.data.zbValue.PID ? this.data.zbValue.CONTENT : "",
                minDate: this.data.minDate,
                maxDate: this.data.maxDate,
                start_time: this.data.start_time ? this.data.start_time : "", // 评估开始时间
                end_time: this.data.end_time ? this.data.end_time : "",// 评估结束时间
                BZID: this.data.BZID ? this.data.BZID :"",
            },
            page: this,
            then(response) {
                wx.navigateTo({
                    url: '/pages/gzjh/gzjh'
                })
                app.$kwz.alert('保存成功')
            }
        })
    },
    // 打开关闭 学校 随行督学 督导事项
    showSchool(e) {
        if (!this.data.contentId) {
            this.setData({schoolShow: !this.data.schoolShow})
        }
    },
    showSxdx(e) {
        if (!(this.data.contentId && this.data.zbValue.PID)){
            this.setData({sxdxShow: !this.data.sxdxShow})
        }
    },
    ddsxShow() {
        this.setData({ddsxShow: !this.data.ddsxShow})
    },
    // 学校确定
    confirmSchool(e) {
        this.data.xx.name = e.detail.data.name;
        this.data.xx.value = e.detail.data.value;
        this.setData({
            schoolShow: !this.data.schoolShow,
            xx: this.data.xx
        })
    },
    // 随行督学确定
    sxdxConfirm({ detail}) {
        let sxDxList = detail.data
        let sxdxIds = []
        let sxdxNames = []
        if (sxDxList && sxDxList.length > 0) {
            for (let i = 0; i < sxDxList.length; i++) {
                sxdxIds.push(sxDxList[i].value)
                sxdxNames.push(sxDxList[i].name)
            }
        }
        this.data.sxdx.name = sxdxNames.join(',')
        this.data.sxdx.value = sxdxIds.join(',')
        this.setData({
            sxdxShow: !this.data.sxdxShow,
            sxdx: this.data.sxdx
        })
    },
    // 修改业务时间 评估开始时间 结束时间
    changeYwsj({ detail}) {
        let ywsj = detail.value
        this.setData({ywsj})
    },
    changeStart_time({ detail}) {
        let start_time = detail.value
        this.setData({ start_time })
    },
    changeEnd_time({detail}) {
        let end_time = detail.value
        this.setData({end_time})
    },
    // 选择搜索条件 => 时段 指标体系
    changeSd(e) {
        let checkedOption = this.data.sdList[e.detail.value]
        this.data.sdValue.value = checkedOption.DMMX_CODE
        this.data.sdValue.name = checkedOption.DMMX_MC
        this.setData({sdValue: this.data.sdValue})
    },
    // 更改评价标准
    changeZb({ detail}) {
        let index = detail.value
        this.data.zbValue.index = index
        this.data.zbValue.CONTENT = this.data.zbList[index].CONTENT
        this.data.zbValue.PID = this.data.zbList[index].PID
        this.setData({ zbValue: this.data.zbValue })
    },
    // 督导纪实修改
    ddsxInput({detail}) {
        this.data.formData.ddsxTxt = detail.data
    },
})