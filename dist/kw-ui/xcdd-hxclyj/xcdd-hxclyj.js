// dist/kw-ui/xcdd-hxclyj/xcdd-hxclyj.js
const app = getApp()

Component({
  properties: {
    // 后续处理意见状态
    status: {
     type: [String,Number],
     value: "1"
    },
    // 后续处理意见状态名字
    status_mc: {
      type: String,
      value: "无意见"
    },
    // 学校名字 
    schoolName: String,
    // 学校id
    schoolId: String,
    // 业务时间
    ywsj: String,
    // 处理期限
    clqx: String,
    // 督导纪实id
    contentId: String,
    // 整改建议 小问题是用到
    zgxsyj: String,
    // 编号
    zgxsBh: String,
    // 整改协商id
    zgxsid: String,
    // 科室id
    ksid: String,
    // 科室名字
    ksName: String,
  },
  data: {
    // 后续处理意见显示隐藏
    hxclyjShow: false,
    // 后续处理意见列表
    hxclyjList: [
      {
      name: '无意见',
      value: '1'
      }, {
        name: '小问题--向学校现场反馈建议',
        value: '4'
      }, {
        name: '一般问题--向学校发送整改建议',
        value: '2'
      }, {
        name: '严重问题--向督导办上报整改建议',
        value: '5'
      }, {
        name: '复杂问题--向科室发送协商意见',
        value: '3'
      }
    ],
    // 存储后续处理意见选择器下标
    hxclyjIndex: '0',
    // 选择器更改前的下标 取消的是用到
    hxclyjOld: "",
    // 科室列表
    ksList: [],
    // 科室在列表中的下标
    fzwtKsIndex: '',
    // 页面初始整改协商id,在用户返回的时,进行新旧id判断,若用户再发了整改后不保存直接返回,则要删除整改
    zgxsidOld: '',
  },
  lifetimes:{
    ready(){
      // 根据状态值，事先改好选择器下标
      switch (this.data.status){
        case "4": this.data.hxclyjIndex = "1";break;
        case "2": this.data.hxclyjIndex = "2"; break;
        case "5": this.data.hxclyjIndex = "3"; break;
        case "3": this.data.hxclyjIndex = "4"; break;
      }
      this.setData({ hxclyjIndex: this.data.hxclyjIndex })
      this.data.zgxsidOld = this.data.zgxsid
    },
    detached() {
      // 进行新旧id判断,若用户再发了整改后不保存直接返回,则要删除整改
      console.log(this.data.zgxsid)
      console.log(this.data.zgxsidOld)
      console.log((this.data.zgxsid != this.data.zgxsidOld) && this.data.zgxsidOld != "")

      if ((this.data.zgxsid != this.data.zgxsidOld) && this.data.zgxsidOld != "") {
        this.deleteDisposeIdeaId()
      }
    },
  },
  methods: {
    // 后续处理意见改变 按下选择器的确定 0没问题不用弹框
    changeHxclyj({ detail }) {
      let index = detail.value;
      this.data.hxclyjOld = this.data.hxclyjIndex;
      // 如果下标大于1(不是无问题和小问题) 就要判断有没有学校和业务时间
      if ( index > 1 && (!this.data.schoolName || !this.data.ywsj)) {
        app.$kwz.alert('请填选择学校和督导时间');
        this.data.hxclyjIndex = this.data.hxclyjOld;
        this.setData({ hxclyjIndex: this.data.hxclyjIndex })
      } else if(index > 0){
        this.data.hxclyjIndex = index;
        this.data.status_mc = this.data.hxclyjList[index].name;
        this.data.status = this.data.hxclyjList[index].value;
        this.setData({
          hxclyjShow: !this.data.hxclyjShow,
          status: this.data.status
        })
        this.loadHxclyj()
      } else {
        this.deleteDisposeIdeaId()
        this.setData({
          status: 1,
          status_mc: "无意见",
          hxclyjShow: !this.data.hxclyjShow,
          hxclyjIndex: index,
          zgxsyj: "",
          zgxsid: ""
        })
        this.eventConfirm()
      }
    },
    // 后续处理意见弹框初始化
    loadHxclyj(){
      if (!this.data.zgxsBh) {
        this.getBh()
      }
      if(this.data.status === '3' && this.data.ksList.length < 1){
        this.getKs()
      }
    },
    // 获取编号
    getBh(){
      app.$kwz.ajax.ajaxUrl({
        url: '/dd_zgxs/getNowTimeString',
        type: 'POST',
        page: this,
        then (response) {
          let datas = response.datas;
          if (datas.BH) {
            this.setData({ zgxsBh: datas.BH })
          }
        }
      })
    },
    // 获取科室列表
    getKs(){
      app.$kwz.ajax.ajaxUrl({
        url: '/ddjl/getKsList',
        type: 'post',
        page: this,
        then (respose) {
          let datas = respose.datas.KSLIST;
          if (datas && datas.length > 0) {
            let ksList = [];
            for (let i = 0; i < datas.length; i++) {
              ksList.push({
                name: datas[i].ORG_MC,
                value: datas[i].ORG_ID
              })
            }
            this.setData({ ksList })
          }
        }
      })
    },
    // 点击弹出框取消用的
    close(){
      this.data.hxclyjIndex = this.data.hxclyjOld;
      this.setData({
        hxclyjShow: !this.data.hxclyjShow,
        hxclyjIndex: this.data.hxclyjIndex,
        status_mc: this.data.hxclyjList[this.data.hxclyjIndex].name
      });
      this.triggerEvent('close')
    },
    // 点击弹出框确定
    confirm(){
      if(this.data.status === "4"){
        if(this.data.zgxsyj){
          this.deleteDisposeIdeaId()
          this.data.zgxsid = ''
          this.eventConfirm()
        } else {
          app.$kwz.alert("请填写建议")
        }
      } else if(this.data.status === "2" || this.data.status === "5"){
        if(!this.data.zgxsyj || !this.data.clqx){
          app.$kwz.alert('未输入建议或整改期限')
          return
        } else {
          this.deleteDisposeIdeaId()
          this.sendZgAjax()
        }
      } else{
        if (this.data.ksName == '点击选择科室' || !this.data.zgxsyj) {
          app.$kwz.alert('未选择科室或整改建议')
          return
        } else{
          this.deleteDisposeIdeaId()
          this.sendXsAjax()
        }
      }
    },
    // 发送整改ajax
    sendZgAjax(){
      app.$kwz.ajax.ajaxUrl({
        url: '/dd_zgxs/doAdd',
        type: 'POST',
        page: this,
        data: {
          ORG_ID_TARGET: this.data.schoolId,
          BH: this.data.zgxsBh,
          ZGXSLYMC: '经常性督导整改',
          CLQX: this.data.clqx,
          ZGXSLY: '1',
          ZGXSDM: "1",
          ZGXSMC: this.data.status_mc,
          XSNR: this.data.zgxsyj,
          YWSJ: this.data.ywsj,
          YWID: this.data.contentId,
          IS_SB: this.data.status === '5' ? '1' : '0' // 是否上报
        },
        then (response) {
          this.data.zgxsid = response.datas.ZGXSID;
          app.$kwz.alert('发送成功');
          this.eventConfirm()
        }
      })
    },
    // 发送协商ajax
    sendXsAjax(){
      app.$kwz.ajax.ajaxUrl({
        url: '/dd_zgxs/doAdd',
        type: 'POST',
        page: this,
        data: {
          ORG_ID_TARGET: this.data.schoolId,
          BH: this.data.zgxsBh,
          ZGXSLYMC: '经常性督导整改',
          XS_ORG_ID: this.data.ksid,
          ZGXSLY: '1',
          ZGXSDM: "2",
          ZGXSMC: this.data.status_mc,
          XSNR: this.data.zgxsyj,
          YWSJ: this.data.ywsj,
          YWID: this.data.contentId
        },
        then(response) {
          this.data.zgxsid = response.datas.ZGXSID
          app.$kwz.alert('发送成功')
          this.eventConfirm()
        }
      })
    },
    // 创建一个确定事件
    eventConfirm() {
      this.triggerEvent('confirm', {
        status: this.data.status,
        status_mc: this.data.status_mc,
        zgxsyj: this.data.zgxsyj,
        zgxsid: this.data.zgxsid
      })
      this.setData({
        hxclyjShow: !this.data.hxclyjShow,
        hxclyjIndex: this.data.hxclyjIndex,
        status_mc: this.data.status_mc,
      });
    },
    // 删除整改id
    deleteDisposeIdeaId(callback){
      if (this.data.zgxsid) {
        console.log("马上删除整改")
        app.$kwz.ajax.ajaxUrl({
          url: '/dd_zgxs/doDelete',
          type: 'POST',
          page: this,
          data: {
            ZGXSID: this.data.zgxsid
          },
          success (data) {
            this.data.zgxsid = ''
          }
        })
      }
    },
    // 小问题输入整改建议
    inputZgxsyj({detail}){
      this.setData({zgxsyj: detail.value})
    },
    // 修改处理期限
    changeClqx({ detail }){
      this.setData({ clqx: detail.value })
    },
    // 科室选择
    changeKs({detail}) {
      let index = detail.value
      this.setData({ 
        fzwtKsIndex: index,
        ksName: this.data.ksList[index].name,
        ksid: this.data.ksList[index].value
      })
    }
  }
})
