const app = getApp()
Page({
  data: {
    // 处理 确认整改（验收） 权限 
    hasClAuth: false,
    hasYsAuth: false,
    // 表单数据
    data:{
      BH:"",
      XXMC:"",
      XSNR:"",
      CLQX:"",
      RQ:"",
    },
    // 处理结果显示隐藏
    cljgShow:false,
    // 已处理的详情页显示隐藏
    detailShow: false,
    // 编辑页显示隐藏
    resultShow: false,
    // 身份存储 督学||学校
    SF: '',
  },
  onLoad(query) {
    this.data.data.ZGXSID = query.ZGXSID
    if(query.SF){
      this.setData({SF: query.SF})
    }
    this.loadData()
    this.has()
  },
  // 初始化
  loadData () {
    app.$kwz.ajax.ajaxUrl({
      url: 'dd_zgxs/doSelectByPrimary',
      type: 'POST',
      data: {
        ZGXSID: this.data.data.ZGXSID
      },
      page: this,
      then (response) {
        let datas = response.datas
        datas.IS_PHONE = '2'
        if (datas && datas.ZGXSID) {
          this.data.data = datas
          // 是学校且状态不是整改完成
          if (this.data.SF === 'xx' && datas.CLZTDM < '26') {
            // 处理结果按钮
            this.data.resultShow = true
          }
          // 是督学且状态是整改完成
          if (this.data.SF === 'dx' || datas.CLZTDM === '26') {
            // 处理结果的展示
            this.data.detailShow = true
          }
        }
        if (this.data.SF) { // 如果是处理/验收进来的
          // 如果还在整改中 且是学校点进来 改状态码为3（学校签收）
          if (this.data.data.CLZTDM <= '23' && this.data.SF === 'xx') {
            this.changeStatue('23')
            // 如果是督学点进来且学校整改完成 将状态码改成5（督学签收）
          } else if (this.data.data.CLZTDM === '24' && this.data.SF === 'dx') {
            this.changeStatue('25')
          }
        } else { // 否则就是新增进来的
          this.detailShow = true
        }
        this.setData({
          data: this.data.data,
          resultShow: this.data.resultShow,
          detailShow: this.data.detailShow,
        })
      }
    })
  },
  // 点击处理事件(学校才有)
  fn_zggz_zgtzs_dispose () {
    if (!this.data.data.CLBG) {
      app.$kwz.alert('请填写处理结果')
      return
    }
    app.$kwz.ajax.ajaxUrl({
      url: 'dd_zgxs/doUpdate/XSYJ',
      type: 'POST',
      data: {
        CLBG: this.data.data.CLBG,
        CMS_LMTYPE: '1',
        IS_PHONE: '2',     // 标记此内容是来自手机端
        ZGXSID: this.data.data.ZGXSID,
        CLLX: '24'
      },
      page: this,
      then (response) {
        wx.redirectTo({ url: '/pages/zggz/xsyj/xsyj' })
        app.$kwz.alert('保存成功')
      }
    })
  },
  
  // 改变处理状态
  changeStatue (status) {
    if(typeof status === 'object'){
      status = status.currentTarget.dataset.status
    }
    app.$kwz.ajax.ajaxUrl({
      url: 'dd_zgxs/doUpdate/XSYJ',
      type: 'POST',
      data: {
        CMS_LMTYPE: '1',
        ZGXSID: this.data.data.ZGXSID,
        CLLX: status
      },
      page: this,
      then (response) {
        if (status === '26') {
          wx.redirectTo({ url: '/pages/zggz/xsyj/xsyj' })
        }
      }
    })
  },
  // 获取按钮权限
  has(){
    app.$kwz.hasAuth('dd_zgxs/doUpdate/XSYJ', (auth) => {
      auth ? this.setData({ hasClAuth: auth }) : ""
    })
    app.$kwz.hasAuth('dd_zgxs/zgtz_done', (auth) => {
      auth ? this.setData({ hasYsAuth: auth }) : ""
    })
  },
  // 督导纪实修改
  cljgInput({ detail }) {
    this.data.data.CLBG = detail.data
  },
  //打开关闭 处理结果
  changeCljgShow(){
    this.setData({ cljgShow: !this.data.cljgShow })
  },
 })