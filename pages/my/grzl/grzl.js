const app = getApp()
Page({
    data: {
        user: {
            IMAGE: '', // 图像fid
            XM: '', // 姓名
            U_USERNAME: '', // 显示名
            AGE: '', // 年龄
            XBM: '', // 性别码
            XBMC: '男', // 性别名称
            DXLXM: '', // 督学类型码
            DH: '', // 电话
            SFZJLXM: '', // 身份证件码
            SFZJH: '', // 身份证件号
            MZM: '', // 民族码
            BIRTH: '', // 出生年月
            XL: '', // 学历
            ZYJSZC: '', // 专业技术职称
            ZW: '', // 职务
            WORKUNIT: '', // 工作单位
            JL: '', // 简介
            DXID: "", // 督学id
            uid: "", // 用户id
        },
        imageUrl: "/static/images/DefaultImg.png", // 保存的时候要用到的头像fid
        mc: {
            xbMc: '',
            zyjszcMc: '',
            xlMc: '',
            mzMc: '',
            sfzjlxMc: '',
            dxlxMc: ''
        },
        alertXbShow: false,
        alertSfzjlxShow: false,
        alertMzShow: false,
        alertXlShow: false,
        alertZyjszcShow: false,
        jlShow: true,
        // 选择器值
        checkList: [],
        inputList: {},
        dms: {}
    },
    onLoad() {
        app.$kwz.loadDms('DM_XD,DM_MZ,DM_XB,DM_XK,DM_ZW,DM_XLCC,DM_SFZJLX,DM_ZYJSDJ,DM_DD_DXLX,DM_XWCC', dms => {
            this.setDms(dms)
            this.init()
        })
    },
    // 加载设置各选择器
    setDms(dms){
        this.data.dms = app.$kwz.copyJson(dms) || {}
        for (let i in this.data.dms) {
            let dm = this.data.dms[i]
            dm.unshift({
                DMMX_CODE: "", DMMX_MC: "请选择"
            })
            for (let j in dm) {
                dm[j].label = dm[j].DMMX_MC
                dm[j].value = dm[j].DMMX_CODE
            }
        }
        this.setData({
            dms: this.data.dms
        })
    },
    // 加载数据
    init() {
        app.$kwz.ajax.ajaxUrl({
            url: 'dd_dxgl/selectByPrimaryKeyGrzl',
            type: 'POST',
            page: this,
            then(response) {
                let datas = response.datas
                if (datas) {
                    this.data.user = datas
                    // 后台返回的是一个fid，微信不支持，需要将文件下载下来，然后将src指向本地地址
                    let _this = this
                    app.$kwz.cacheAttach({
                        url: 'jc_file/doDownload?F_ID=' + datas.IMAGE,
                        page: this,
                        success({
                            tempFilePath
                        }) {
                            this.setData({
                                imageUrl: tempFilePath
                            })
                        }
                    })
                    app.$kwz.getLoginUser((user) => {
                        if (user) {
                            _this.data.user.uid = user.uid
                            _this.setData({
                                user: _this.data.user
                            })
                        }
                    }, this)
                    this.showMc(this.data.user.XBM, 'DM_XB', 'xbMc')
                    this.showMc(this.data.user.DXLXM, 'DM_DD_DXLX', 'dxlxMc')
                    this.showMc(this.data.user.SFZJLXM, 'DM_SFZJLX', 'sfzjlxMc')
                    this.showMc(this.data.user.MZM, 'DM_MZ', 'mzMc')
                    this.showMc(this.data.user.XL, 'DM_XLCC', 'xlMc')
                    this.showMc(this.data.user.ZYJSZC, 'DM_ZYJSDJ', 'zyjszcMc')
                    this.setData({
                        user: this.data.user
                    })
                }
            }
        })
    },
    // 保存
    saveUserSet() {
        if (!this.data.user.XM) {
            app.$kwz.alert('姓名不能为空')
            return false
        }
        if (this.data.user.DH.search(/^(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/)) {
            app.$kwz.alert('电话未输入或输入有误')
            return false
        }
        // 没修改过年龄直接保存，是number类型
        let age = String(this.data.user.AGE)
        if (age.search(/^[1-9][0-9]?[0-9]$/) && age !='null' && age) {
            app.$kwz.alert('年龄输入有误')
            return false
        }
        if (this.data.user.SFZJH && this.data.user.SFZJLXM == '1' && this.data.user.SFZJH.search(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/)) {
            app.$kwz.alert('身份证件号输入有误')
            return false
        }
        app.$kwz.ajax.ajaxUrl({
            url: 'dd_dxgl/doUpdateGrzl',
            type: 'POST',
            data: {
                "MZM": this.data.user.MZM || "", // 民族码
                "XBM": this.data.user.XBM || "", // 性别码
                "JL": this.data.user.JL, // 简介
                "DH": this.data.user.DH, // 电话
                "ZYJSZC": this.data.user.ZYJSZC || "", // 专业技术职称
                "U_ID": this.data.user.uid, // 当前用户id
                "DXID": this.data.user.DXID, //督学di,用户不一定是督学,顾要传督学id
                "SFZJLXM": this.data.user.SFZJLXM || "", // 身份证件类型码
                "IMAGE": this.data.user.IMAGE, // 图像uid
                "XL": this.data.user.XL || "", // 学历
                "XM": this.data.user.XM, // 姓名
                "U_USERNAME": this.data.user.U_USERNAME, // 显示名
                "SFZJH": this.data.user.SFZJH, // 身份证件号
                "SJ": "", // 数据库无介绍 传空
                "BIRTH": this.data.user.BIRTH || "", // 出生年月
                "ZW": this.data.user.ZW, // 职务
                "WORKUNIT": this.data.user.WORKUNIT, // 工作单位
                "AGE": this.data.user.AGE // 年龄
            },
            page: this,
            then(response) {
                wx.switchTab({
                    url: '/pages/my/my'
                })
                app.$kwz.alert('保存成功')
            }
        })
    },
    // 将代码表与拿到的代码匹配
    showMc(value, dmsKey, dmMcKey) {
        let dms = this.data.dms[dmsKey]
        if (value && dms && dms.length > 0) {
            for (let i = 0; i < dms.length; i++) {
                if (dms[i].value == value) {
                    this.data.mc[dmMcKey] = dms[i].label
                }
            }
            this.setData({
                mc: this.data.mc
            })
        }
    },
    // 更改头像
    changeIcon() {
        // 调取相册和相机(封装了wx调取和kwz的上传)
        app.$kwz.uploadImg({
            page: this,
            url: 'jc_jsgl/doUpload',
            success(file) {
                let fId = file.datas.saveInfos[0].fId
                app.$kwz.cacheAttach({
                    url: 'jc_file/doDownload?F_ID=' + fId,
                    page: this,
                    success({
                        tempFilePath
                    }) {
                        this.data.user.IMAGE = fId
                        this.setData({
                            imageUrl: tempFilePath,
                            user: this.data.user
                        })
                    }
                })
            }
        })
    },
    // 更改 姓名 显示名  年龄 联系电话 身份证件号 职务 工作单位
    inputXm({detail}) {
        this.data.user.XM = detail.value
        this.setData({
            user: this.data.user
        })
    },
    inputXsm({detail}) {
        this.data.user.U_USERNAME = detail.value
        this.setData({
            user: this.data.user
        })
    },
    inputNl({detail}) {
        this.data.user.AGE = detail.value
        this.setData({
            user: this.data.user
        })
    },
    inputDh({detail}) {
        this.data.user.DH = detail.value
        this.setData({
            user: this.data.user
        })
    },
    inputSfzjh({detail}) {
        this.data.user.SFZJH = detail.value
        this.setData({
            user: this.data.user
        })
    },
    inputZw({detail}) {
        this.data.user.ZW = detail.value
        this.setData({
            user: this.data.user
        })
    },
    inputZzdw({detail}) {
        this.data.user.WORKUNIT = detail.value
        this.setData({
            user: this.data.user
        })
    },
    // 更改 个人简介
    changeGrjj({detail}) {
        this.data.user.JL = detail.value
    },
    // 更改出生年月
    changeBIRTH({detail}) {
        this.data.user.BIRTH = detail.value
        this.setData({
            user: this.data.user
        })
    },
    // 更改 性别 身份证件类型 民族 学历 专业技术职称
    changeXb({detail}) {
        let checkedOption = this.data.dms.DM_XB[detail.value]
        this.data.user.XBM = checkedOption.DMMX_CODE
        this.data.mc.xbMc = checkedOption.DMMX_MC
        this.setData({
            mc: this.data.mc
        })
    },
    changeSfzjlx({detail}) {
        let checkedOption = this.data.dms.DM_SFZJLX[detail.value]
        this.data.user.SFZJLXM = checkedOption.DMMX_CODE
        this.data.mc.sfzjlxMc = checkedOption.DMMX_MC
        this.setData({
            mc: this.data.mc
        })
    },
    changeMz({detail}) {
        let checkedOption = this.data.dms.DM_MZ[detail.value]
        this.data.user.MZM = checkedOption.DMMX_CODE
        this.data.mc.mzMc = checkedOption.DMMX_MC
        this.setData({
            mc: this.data.mc
        })
    },
    changeXl({detail}) {
        let checkedOption = this.data.dms.DM_XLCC[detail.value]
        this.data.user.XL = checkedOption.DMMX_CODE
        this.data.mc.xlMc = checkedOption.DMMX_MC
        this.setData({
            mc: this.data.mc
        })
    },
    changeZyjszc({detail}) {
        let checkedOption = this.data.dms.DM_ZYJSDJ[detail.value]
        this.data.user.ZYJSZC = checkedOption.DMMX_CODE
        this.data.mc.zyjszcMc = checkedOption.DMMX_MC
        this.setData({
            mc: this.data.mc
        })
    },
})