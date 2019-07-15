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
      for(let i in dms) {
        let dm = dms[i]
        for(let j in dm) {
          dm[j].label = dm[j].DMMX_MC
          dm[j].value = dm[j].DMMX_CODE
        }
      }
      this.data.dms = app.$kwz.copyJson(dms) || {}
      this.setData({ dms: this.data.dms})
      console.log(this.data.dms)
      this.init()
    })
  },
  // 加载数据
  init() {
    app.$kwz.ajax.ajaxUrl({
      url: 'dd_dxgl/selectByPrimaryKeyGrzl',
      type: 'POST',
      page: this,
      then (response) {
        let datas = response.datas
        if (datas) {
          this.data.user = datas
          // 后台返回的是一个fid，微信不支持，需要将文件下载下来，然后将src指向本地地址
          let _this = this
          app.$kwz.cacheAttach({
            url: 'jc_file/doDownload?F_ID=' + datas.IMAGE,
            success({tempFilePath}){
              _this.setData({imageUrl: tempFilePath})
            }
          })
          app.$kwz.getLoginUser((user) => {
            if (user) {
              _this.data.user.uid = user.uid
              _this.setData({user:  _this.data.user})
            }
          }, this)
          this.showMc(this.data.user.XBM, 'DM_XB', 'xbMc')
          this.showMc(this.data.user.DXLXM, 'DM_DD_DXLX', 'dxlxMc')
          this.showMc(this.data.user.SFZJLXM, 'DM_SFZJLX', 'sfzjlxMc')
          this.showMc(this.data.user.MZM, 'DM_MZ', 'mzMc')
          this.showMc(this.data.user.XL, 'DM_XLCC', 'xlMc')
          this.showMc(this.data.user.ZYJSZC, 'DM_ZYJSDJ', 'zyjszcMc')
          this.setData({user: this.data.user})
          console.log(this.data.user)
        }
      }
    })
  },
  // 将代码表与拿到的代码匹配
  showMc(value, dmsKey, dmMcKey) {
    let dms = this.data.dms[dmsKey]
    if (value && dms && dms.length > 0) {
      for(let i = 0 ;i < dms.length;i++) {
        if(dms[i].value == value) {
          this.data.mc[dmMcKey] = dms[i].label
        }
      }
      this.setData({mc: this.data.mc})
    }
  },
  // 更改头像
  changeIcon() {
    // 调取相册和相机(封装了wx调取和kwz的上传)
    app.$kwz.uploadImg({
        page: this,
        url: 'jc_jsgl/doUpload',

        success (file) {
          console.log(file)
        }
      })
  },
  // 更改 姓名 显示名  年龄 联系电话 身份证件号 职务 工作单位
  inputXm({detail}) {
    this.data.user.XM = detail.value
    this.setData({ user: this.data.user})
  },
  inputXsm({detail}) {
    this.data.user.U_USERNAME = detail.value
    this.setData({ user: this.data.user})
  },
  inputNl({detail}) {
    this.data.user.AGE = detail.value
    this.setData({ user: this.data.user})
  },
  inputDh({detail}) {
    this.data.user.DH = detail.value
    this.setData({ user: this.data.user})
  },
  inputSfzjh({detail}) {
    this.data.user.SFZJH = detail.value
    this.setData({ user: this.data.user})
  },
  inputZw({detail}) {
    this.data.user.ZW = detail.value
    this.setData({ user: this.data.user})
  },
  inputZzdw({detail}) {
    this.data.user.WORKUNIT = detail.value
    this.setData({ user: this.data.user})
  },
  // 更改 个人简介

})