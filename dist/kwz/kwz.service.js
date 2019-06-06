// kwz服务
// kwz的封装方法

import util from './kwz.util' // 工具类
import store from './kwz.store' // 数据缓存
import { kwbms, kwencrypts, kwfilters } from './kwz.pc' // pc端的一些kwz逻辑
import weixin from './kwz.weixin' // kwz对微信接口的封装
import consts from './kwz.const' // kwz常量配置

/**
 * 发送get请求
 * @param {string} url 请求路径
 * @param {object} data 请求参数
 * @param {function} success 成功回调函数
 * @param {object} page 回调函数指向
 * @param {function} fail 失败回调函数
 */
const get = (url, data, success, page, fail) => {
  ajaxUrl({ url, data, success, page, fail, type: 'GET'})
}

/**
 * 发送post请求
 * @param {string} url 请求路径
 * @param {object} data 请求参数
 * @param {function} success 成功回调函数
 * @param {object} page 回调函数指向
 * @param {function} fail 失败回调函数
 */
const post = (url, data, success, page, fail) => {
  ajaxUrl({ url, data, success, page, fail, type: 'POST'})
}

// 是否已经初始化=》初始化主要包括请求token
let _ajaxinited = false

/**
 * 加锁ajaxUrl
 * @param {object} option
 */
const ajaxUrl = (option) => {
  let that = this
  if (!_ajaxinited) {
    setTimeout(() => {
      util.cfp(ajaxUrl, that, [option])
    }, 500)
  } else {
    ajaxUrlUnLock(option)
  }
}

/**
 * 未加锁的ajaxUrl
 * @param {object} option 
 */
const ajaxUrlUnLock = (option) => {

  const success = (cb, eb) => {
    return (data, option) => {
      // 按照weixin.request的封装，只有当httpcode=200时，才会进入此方法
      let responseData = data.data
      if (responseData && (!responseData.statusCode || responseData.statusCode === '200')) {
        util.cfp(cb, (option.page || (option.vue || this)), [responseData, option, data])
      } else {
        util.cfp(eb, (option.page || (option.vue || this)), [data, option], (data) => {
          weixin.alert(data.msg || '请求失败', 'none', 5000)
        })
      }
    }
  }

  const fail = (cb) => {
    return (error, option) => {
      if (error) {
        if (error.statusCode === 401) {
          // token不对或者session丢失
          initVisit(() => {
            if (option.repeat !== true) {
              let rOption = util.copyJson(option)

              rOption.page = option.page
              rOption.success = option.success
              rOption.fail = option.fail
              option.complete = option.complete
              
              rOption.repeat = true

              // 重新请求
              weixin.request(rOption)

              return
            }
          }, option.page)
        } else if (error.statusCode === 402) {
          weixin.alert('无权限进行此项操作', 'none', 5000)
          return
        }
      } else {
        weixin.alert(data.msg || '网络错误', 'none', 5000)
      }
      util.cfp(cb, option.page || (option.vue || this), [error])
    }
  }

  const complete = (cb) => {
    return (data, option) => {
      weixin.closeLoading()
      setSession(data)
      util.cfp(cb, (option.page || (option.vue || this)), [data, option.option])
    }
  }

  let ajaxOption = util.copyJson(option)

  // ajaxUrl默认post请求
  ajaxOption.type = ajaxOption.type || 'POST'
  
  if (ajaxOption.data) {
    ajaxOption.data = handleData(ajaxOption.data)
  }
  
  ajaxOption = handleUrl(ajaxOption)

  ajaxOption.header = handleHeader(ajaxOption)

  ajaxOption.page = option.page

  ajaxOption.option = option

  ajaxOption.success = success(option.success || option.then, option.fail)
  ajaxOption.fail = fail(option.fail || option.catch)
  ajaxOption.complete = complete(option.complete)

  weixin.request(ajaxOption)
}

/**
 * 处理请求数据，包括加密什么的
 * @param {object} data 
 */
const handleData = (data) => {
  if (store.isEncode()) {
    data = kwbms(data)
    if (store.isEncrypt()) {
      data = kwfilters(kwencrypts(data))
    }
  }
  return data || {}
}

/**
 * 格式化url => 加入token
 * @param {object} option 
 */
const handleUrl = (option) => {
  if (store.getToken()) {
    let url = option.url
    let data = option.data || {}
    // 如果url中没有包含token参数 && 数据请求中没有token
    if (!/^.*(\?|&)token.*$/.test(url) && !data.token) {
      if (url.endsWith('?') || url.endsWith('&')) {
        url += 'token=' + store.getToken()
      } else {
        if (url.indexOf('?') < 0) {
          url += '?token=' + store.getToken()
        } else {
          url += '&token=' + store.getToken()
        }
      }
      option.url = (url.startsWith('/') ? '' : '/') + url
    }
  }
  return option
}

const handleHeader = (option) => {
  let header = (option && option.header) || {}
  header['cookie'] = `${consts.getSessionName()}=${store.getSessionId()}`
  return header
}

/**
 * 记录sessionid
 * @param {object} response 
 */
const setSession = (response) => {
  if (response && response.header && response.header['Set-Cookie']) {
    let cookieArray = response.header['Set-Cookie'].split(';')
    for (let i = 0; i < cookieArray.length; i++) {
      if (cookieArray[i]) {
        let cArray = cookieArray[i].split('=')
        if (cArray[0] && cArray[0].trim() === consts.getSessionName()) {
          store.setSessionId(cArray[1])
        }
      }
    }
  }
}

/**
 * 初始化配置
 * @param {function} callback 成功后的回调
 * @param {object} page
 */
const initVisit = (callback, page) => {
  weixin.request({
    url: '/visit.jsp',
    success (data) {
      setSession(data)
      initToken(callback, page)
    },
    page,
    header: handleHeader(),
    error (error) {
      weixin.alert(error.msg || '初始化错误-10001')
    }
  })
}

/**
 * 初始化token
 * @param {function} callback 
 * @param {object} page 
 */
const initToken = (callback, page) => {
  let option = {
    url: '/open/app/loadConfig',
    type: 'GET',
    page,
    success (response, option) {
      if (response) {
        _ajaxinited = true
        // 存储加密等数据
        store.setRelData(response.datas)
      }
      util.cfp(callback, (option.page || (option.vue || this)), [response, option.option])
    },
    error (error) {
      util.alert(error.msg || '初始化错误-10002')
    }
  }
  ajaxUrlUnLock(option)
}

/**
 * 缓存文件
 * @param {object} option 
 */
const cacheAttach = (option) => {
  let attachOption = util.copyJson(option)

  if (attachOption.data) {
    attachOption.data = handleData(attachOption.data)
  }
  
  attachOption = handleUrl(attachOption)

  attachOption.header = handleHeader(attachOption)

  attachOption.success = (filepath) => {
    util.cfp(option.success, option.page || (option.vue || this), [filepath])
  }

  weixin.requestAttach(attachOption)
}

/**
 * 是否登陆
 * @return true/false 是/否
 */
const isLogin = () => {
  return store.isLogin()
}

/**
 * 判断登陆，如果未登陆=》会切换至my tab然后提示登陆
 */
const checkLogin = (success, page) => {
  if (!isLogin()) {
    weixin.switchTab({
      url: '../my/my', 
      success () {
        weixin.alert('请登录')
        util.cfp(success, page || this)
      }, page
    })
  } else {
    return true
  }
}

/**
 * 初始化自动登陆信息
 * @param {function} callback 
 * @param {object} page 
 */
const initAutoLogin = (callback, page) => {
  initLoginUser(callback, page)
  // util.cfp(callback, page || this, [])
}

/**
 * 从后端加载当前登陆用户
 * @param {function} callback 
 * @param {object} page 
 */
const initLoginUser = (callback, page) => {
  ajaxUrl({
    url: '/open/loadInfos',
		then (response) {
			store.setLoginUser(response.datas);
			util.cfp(callback, page || this, [response.datas])
		}
  })
}

/**
 * 退出
 */
const logout = (callback, app) => {
  // 登出操作
  get('/login/open/logout')
  // 清除缓存
  weixin.clearStorage()
  // 设置登陆false
  store.setLogin(false)
  // 重置
  initVisit(() => {
    // 回调
    util.cfp(callback, app || this, [])
  })
}

/**
 * 加载工作区
 */
const initProducts = (callback, page) => {
  getCommonMenus((commonMenus) => {
    // callback
    let retMenus = []

    if(commonMenus && commonMenus._menus_ && commonMenus._menus_.children){
      // 产品树
      let menus = hasFunc(commonMenus._menus_.children, commonMenus.readPro)
      retMenus.push(...menus)
    }

    util.cfp(callback, this || page, [retMenus])
  }, page)
}

const getCommonMenus = (callback, page) => {
  store.getCommonMenus((commonMenus) => {
    if (!commonMenus) {
      ajaxUrl({
        url: '/open/loadMenus',
        page,
        success (response) {
          if (response && response.datas) {
            store.setCommonMenus(response.datas)
            util.cfp(callback, page || this, [response.datas])
          }
        }
      })
    } else {
      util.cfp(callback, this || page, [commonMenus])
    }
  }, page)
}

/**
 * from kwz.uniapp.js
 * @param {array} comonProductsTree 
 * @param {array} userReadPro 
 */
const hasFunc = (comonProductsTree = [], userReadPro = []) => {
  let commonMenu = []
  if (comonProductsTree.length > 0) {
    let productConfig = consts.getProductConfig()
    let workspace = productConfig.workspace
    if (typeof userReadPro === 'string') {
			userReadPro = userReadPro.split(',')
    }
    for (let i = 0; i< comonProductsTree.length; i++){
			for (let j = 0; j< workspace.length; j++){
				if (comonProductsTree[i].PRO_ID === workspace[j].proId) {
					let childrenFun = workspace[j].children
					let comonChildrenFun = comonProductsTree[i].children
					for (let m = 0; m< childrenFun.length; m++){
						for (let n = 0; n< comonChildrenFun.length; n++){
							if (childrenFun[m].funId === comonChildrenFun[n].FUN_ID
							 && userReadPro.length > 0) {
								 for (let k = 0; k<userReadPro.length; k++) {
									 if (userReadPro[k] === comonChildrenFun[n].PRO_ID) {
										 comonChildrenFun[n].THUMB = childrenFun[m].icon
										 comonChildrenFun[n].PRO_MC = childrenFun[m].funMc || comonChildrenFun[n].PRO_MC
										 comonChildrenFun[n].LINK = childrenFun[m].link
										 commonMenu.push(comonChildrenFun[n])
										 break
									 }
								 }
							}
						}
					}
				}
			}
		}
  }
  return commonMenu
}

export default {
  ajaxUrl, get, post, initVisit, initToken, cacheAttach,
  // 兼容老的写法
  ajax: {
    ajaxUrl
  }, checkLogin, isLogin, initAutoLogin, setSession, logout, initProducts,
  cfp: util.cfp,
  getLoginUser: store.getLoginUser
}