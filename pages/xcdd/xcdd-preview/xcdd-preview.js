const app = getApp()
Page({
  data: {
    // 督导纪实数据
    ddjsData:{
      STATUS_MC:"", // 整改类型名称
      XXMC: '', // 学校名称
      YWSJ: '', // 督导时间
      AUTHOR: '',	// 创建人
      GZAP_YWID:"", // 工作计划id
      DXJY: '',	// 亮点 督学建议 典型经验和做法
      CZWT: '', // 存在问题
      ZGJY: '', // 整改意见 小问题
      STATUS: '1', // 是整改还是协商
      PGID:"", // 评估id
    },
    // 工作计划数据
    gzjhData: {
      TXT: "", // 督导事项
      BZID:"", // 评估标准id
    },
    // 评估数据
    pgbzData: {},
    // 整改协商数据
    zgxsData:{
      XSNR: '', // 整改协商内容
      CLQX: '', // 处理期限
      CLBG: {}, // 处理报告
      YWSJ: '', // 整改协商时间
      CLZTDM: '', // 整改协商处理状态代码
    },
    // 督导纪实
    ddjs: {},
    // 督导纪实id
    contentId: '',
    // 督导事项显示隐藏
    ddsxShow: false,
    // 督导事项cell显示隐藏
    ddsxCellShow: false,
    // 督导纪实显示隐藏
    ddjsShow: false,
    //评估结果显示隐藏
    pgjgShow: false,
    // 亮点(典型经验和做法)显示隐藏
    jyzfShow: false,
    // 存在问题显示隐藏
    czwtShow: false,
    // 整改报告显示隐藏
    // zgbgShow: false,
    // 整改报告Cell显示隐藏
    // zgbgCellShow: false,
    // 后续处理意见显示隐藏
    hxclyjShow: false,
    // 后续处理意见Cell显示隐藏
    hxclyjCellShow: false,
    raterContainer:{},
    // 评估处理后的模板数据
    pgContainer:{}
  },
  onLoad: function (param) {
    if (param && param.CONTENT_ID) {
    	this.data.contentId = param.CONTENT_ID
    	this.loadData()
    }
  },
  // 页面初始化
  loadData() {
    if (this.data.contentId) {
    	app.$kwz.ajax.ajaxUrl({
    		url: '/ddjl/doSelectByPrimaryKey',
    		type: 'POST',
    		data: {
    			CONTENT_ID: this.data.contentId
    		},
    		page: this,
    		then(response) {
          response.datas.DDJS = app.$kwz.formatImg(response.datas.DDJS)
          this.data.ddjsData = response.datas
          this.setData({
            ddjsData: this.data.ddjsData
          })
    			if (this.data.ddjsData && this.data.ddjsData.CONTENT_ID) {
            // 加载工作安排信息
    				if(this.data.ddjsData.GZAP_YWID) {
    					this.loadGzjhData()
    				}
    				// this.zgbgCellShow = true
            // 加载整改通知||协商意见
    				if(this.data.ddjsData.STATUS == '2' || this.data.ddjsData.STATUS == '5' || this.data.ddjsData.STATUS == '3' ) {
              this.getZgXs()
    				}
    			}
         
    		}
    	})
    }
  },
  // 加载工作计划信息
  loadGzjhData(){
    app.$kwz.ajax.ajaxUrl({
    	url: '/dd_gzap/doSelectByPrimary/DDGZAP',
    	type: 'POST',
    	data: {
    		CONTENT_ID: this.data.ddjsData.GZAP_YWID
    	},
    	page: this,
    	then (response) {
    		let datas = response.datas
    		if(datas && datas.map) {
    			this.data.ddsxCellShow = true
          this.data.gzjhData = datas.map
          this.data.gzjhData.TXT = app.$kwz.formatImg(this.data.gzjhData.TXT)
          // this.loadPgData() 评估暂时删除
          this.setData({ gzjhData: this.data.gzjhData})
          console.log(this.data.gzjhData)
    		}
    	}
    })
  },
  // 获取整改协商数据
  getZgXs(){
    app.$kwz.ajax.ajaxUrl({
    	url: 'dd_zgxs/selectZgxsList',
    	type: 'POST',
    	data: {
    		CONTENT_ID: this.data.contentId,
    		ZGXSLY: '1'
    	},
    	page: this,
    	then (response) {
        this.data.zgxsData = response.datas[0]
    		if(this.data.zgxsData) {
    			this.data.zgxsData.YWSJ = this.data.zgxsData.YWSJ.substr(0, 10)
    		}
        this.data.zgxsData.CLBG = app.$kwz.formatImg(this.data.zgxsData.CLBG)
        this.setData({ zgxsData: this.data.zgxsData})
    	}
    })
  },
  // 督导事项 督导纪实 建议做法(亮点) 存在问题 显示隐藏
  ddsxShow(){
    this.setData({ ddsxShow: !this.data.ddsxShow})
  },
  ddjsShow(){
    this.setData({ ddjsShow: !this.data.ddjsShow})
  },
  jyzfShow(){
    this.setData({ jyzfShow: !this.data.jyzfShow})
  },
  czwtShow(){
    this.setData({ czwtShow: !this.data.czwtShow})
  },
  hxclyjShow(){
    this.setData({ hxclyjShow: !this.data.hxclyjShow})
  }
})