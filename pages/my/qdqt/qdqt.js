const app = getApp()
Page({
  data: {
    userOrgs: [{
      ORG_MC: '在您附近未找到学校',
      ORG_ID: ''
    }],
    // 加载的学校是否空
    userOrgsShow: false,
    // 加载更多的提示信息
    loadMore: {
        text: "正在加载",
        show: true
    },
    // 当前的签到记录
    currentRecord: {
      ORG_ID: ''
    },
    // 显示签到页面还是显示签出页面
    currentRecordShow: true,
    // 历史记录
    currentRecords: [],
    // 分页参数
    pageParam: {
    	page: 1
    }
  },
  onLoad() {
    this.initPosition()
    this.loadPistionRecords()
  },
  onReachBottom() {
    this.data.loadMore.show = true
    this.data.loadMore.show = "正在加载..."
    this.setData({ loadMore: this.data.loadMore })
    this.initPage()
  },
  // 加载当前签到状态 是签到还是签退 返回当天签到结果
  initPosition() {
    app.$kwz.ajax.ajaxUrl({
      url: 'jc_gps/getCurrentPostionRecord',
      type: 'GET',
      page: this,
      then(response) {
        if (response.statusCode === '200' && response.datas && response.datas.length > 0) {
          // 已存在签到记录
          this.data.currentRecordShow = false
          this.data.currentRecord = response.datas[0]
        } else {
          this.data.currentRecordShow = true
          this.posi()
        }
        this.setData({
          currentRecordShow: this.data.currentRecordShow,
          currentRecord: this.data.currentRecord
        })
      }
    })
  },
  // 定位 获取当前位置
  posi(){
    let _this = this
    // 判断有无定位权限
    wx.getSetting({
      success(res) {
        let authSet = res.authSetting
        if (authSet['scope.userLocation']) {
          wx.getLocation({
            success(res) {
              _this.getSchoolList(res)
            }
          })
        } else {
          // 弹出请求权限
          app.$kwz.alert("请授予定位权限")
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              _this.initPosition()
            }
          })
        }
      },
    })
  },
  // 获取当前位置附近的学校列表
  getSchoolList(res){
    app.$kwz.ajax.ajaxUrl({
      url: '/jc_gps/getOrgByPosition',
      type: 'GET',
      data: {
        latitude: res.latitude,
        longitude: res.longitude
      },
      page: this,
      then(response) {
        if (response.statusCode === '200' && response.datas) {
          this.data.userOrgs = response.datas
          this.data.userOrgsShow = true
        } else {
					this.data.userOrgsShow = false
        }
        this.setData({
          userOrgs: this.data.userOrgs,
          userOrgsShow: this.data.userOrgsShow
        })
      }
    })
  },
  // 加载打卡历史纪录
  loadPistionRecords() {
    this.initPage(true)
  },
  // 初始化页面 type =>true/false 初始化/增加
  initPage(type) {
    this.data.pageParam.page = type ? 1 : this.data.pageParam.page
    // 加载用户所有签到结果
    app.$kwz.ajax.ajaxUrl({
      url: 'jc_gps/listPositionRecord',
      type: 'GET',
      page: this,
      data: {
        page: this.data.pageParam.page
      },
      then(response) {
        if (response.statusCode === '200') {
          let datas = response.datas
          if (datas && datas.length > 0) {
            for (let i = 0; i < datas.length; i++) {
              datas[i].inOrgMc = datas[i].IN_ORG_MC + '（' + datas[i].IN_TIME.toString().substr(0, 10) + '）'
              datas[i].inTime = datas[i].IN_TIME.toString().substr(11, datas[i].IN_TIME.length)
              datas[i].outTime = datas[i].OUT_TIME === null ? '未签出' : datas[i].OUT_TIME.toString().substr(11, datas[i].IN_TIME.length)
            }
            this.data.pageParam.page++
            if (type) {
              this.data.currentRecords = datas
              if(datas.length < 20){
                this.data.loadMore.show = false
                this.data.loadMore.text = "没有更多数据了"
              }
            } else {
              this.data.currentRecords.concat(datas)
              this.data.loadMore.show= false
              this.data.loadMore.text= "上拉显示更多"
            }
          } else {
            this.data.loadMore.show= false
            this.data.loadMore.text= "没有更多数据了"
            if (type) {
              this.data.dataList = []
            }
          }
        }
        this.setData({
          currentRecords: this.data.currentRecords,
          loadMore: this.data.loadMore,
          pageParam: this.data.pageParam
        })
      }
    })
  },
  // 签到/签出
  checkPosition() {
    if (!this.data.currentRecord.RECORD_ID && !this.data.currentRecord.ORG_ID) {
    	app.$kwz.alert('未定位学校，请先定位学校')
      return
    }
    let positionData = {}
    if (this.data.currentRecord.ORG_ID) {
    	for (let i = 0; i < this.data.userOrgs.length; i++) {
    		if (this.data.userOrgs[i].ORG_ID === this.data.currentRecord.ORG_ID) {
    			positionData = this.data.userOrgs[i]
    		}
    	}
    } else if (this.data.currentRecord.RECORD_ID) {
    	positionData.record_id = this.data.currentRecord.RECORD_ID
    }
    this.loadPosition((res) => {
    	positionData.latitude = res.latitude
    	positionData.longitude = res.longitude
    	app.$kwz.ajax.ajaxUrl({
    		url: 'jc_gps/savePositionRecord',
    		type: 'POST',
    		data: positionData,
    		page: this,
    		then (response) {
    			if (response.statusCode === '200') {
    				// 加载当前签到状态 
    				this.initPosition()
    				// 加载历史记录
    				this.loadPistionRecords()
    			}
    			app.$kwz.alert(response.datas.resultMsg || '操作失败')
    		}
    	})
    })
  },
  changePostionOrg({detail}) {
    this.data.currentRecord.ORG_ID = detail.value
    this.setData({ currentRecord: this.data.currentRecord})
  },
  loadPosition(callback) {
    let _this = this
    wx.getLocation({
    	success (res) {
    		if (typeof callback === 'function') {
    			callback.apply(_this, [res])
    		}
    	}, 
    	fail () {
    		app.$kwz.alert('获取当前地理位置失败')
    	}
    })
  }
})