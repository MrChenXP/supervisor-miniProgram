// kwz.service

import util from './kwz.util.js'
import ajax from './kwz.ajax.js'
import store from './kwz.store.js'
import {xxteaEncrypt64} from '../xxtea/xxtea'

/**
 * 发送get请求
 * @param {string} url 请求路径
 * @param {object} data 请求参数
 * @param {function} success 成功回调函数
 * @param {object} app 回调函数指向
 * @param {function} fail 失败回调函数
 */
const get = (url, data, success, app, fail) => {
  ajaxUrl({ url, data, success, app, fail, type: 'GET'})
}

/**
 * 发送post请求
 * @param {string} url 请求路径
 * @param {object} data 请求参数
 * @param {function} success 成功回调函数
 * @param {object} app 回调函数指向
 * @param {function} fail 失败回调函数
 */
const post = (url, data, success, app, fail) => {
  ajaxUrl({ url, data, success, app, fail, type: 'POST'})
}

const fail = (cb) => {
  return (error, option) => {
    if (error) {
      if (error.statusCode === 401) {
        
        // token不对或session丢失 =》 刷新token,并重新请求,只重新请求一次
        initVisit(() => {
          if (option.repeat !== true) {
            let rOption = util.copyJson(option)
            rOption.success = option.success
            rOption.fail = option.fail
            option.complete = option.complete
            
            rOption.repeat = true

            console.log(rOption)
            // 重新请求
            ajax(rOption)

            return
          } else {
            util.wxAlert('请登录', 'none', 5000)
            // session丢失
            logout()
          }
        })
      } else if (error.statusCode === 402) {
        util.wxAlert('无权限进行此项操作', 'none', 5000)
        return
      }
    }

    util.cfp(cb, (option.vue || (option.app || this)), [error, option.option])
  }
}

const success = (cb, eb) => {
  return (data, option) => {
    let responseData = data.data
    if (responseData && (!responseData.statusCode || responseData.statusCode === '200')) {
      util.cfp(cb, (option.vue || (option.app || this)), [responseData, option])
    } else {
      util.cfp(eb, (option.vue || (option.app || this)), [data, option], (data) => {
        util.wxAlert(data.msg || '请求失败', 'none', 5000)
      })
    }
  }
}

const complete = (cb) => {
  return (data, option) => {
    util.wxCloseLoadding()
    setSession(data)
    util.cfp(cb, (option.vue || (option.app || this)), [data, option.option])
  }
}

const setSession = (response) => {
  if (response && response.header && response.header['Set-Cookie']) {
    let cookieArray = response.header['Set-Cookie'].split(';')
    for (let i = 0; i < cookieArray.length; i++) {
      if (cookieArray[i]) {
        let cArray = cookieArray[i].split('=')
        if (cArray[0] && cArray[0].trim() === store.getSessionName()) {
          store.setSessionId(cArray[1])
        }
      }
    }
  }
}

/**
 * ajaxUrl
 * @param {object} option
 */
const ajaxUrl = (option) => {
  let ajaxOption = util.copyJson(option)
  ajaxOption.type = ajaxOption.type || 'POST'
  
  if (ajaxOption.data) {
    ajaxOption.data = handleData(ajaxOption.data)
  }
  
  ajaxOption = handleUrl(ajaxOption)

  ajaxOption.option = option

  ajaxOption.success = success(option.success, option.fail)
  ajaxOption.fail = fail(option.fail)
  ajaxOption.complete = complete(option.complete)

  util.wxOpenLoadding()

  ajax(ajaxOption)

}

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
      option.url = url
    }
  }
  return option
}

/**
 * 退出
 */
const logout = () => {
  get('/open/logout')
}

/**
 * 初始化访问=》1.退出。2.请求新的session。3.获取新的token
 */
const initVisit = (callback) => {
  get('/visit.jsp', null, () => {
    initToken(callback)
  }, null, (error, option) => {
    util.wxAlert(error.msg || '初始化失败', 'none', 5000)
  })
}

/**
 * 获取新的token
 */
const initToken = (callback) => {
  post('/open/app/loadConfig', null, (response, option) => {
    if (response) {
      // 存储加密等数据
      store.setRelData(response.data)
    }
    util.cfp(callback, (option.vue || (option.app || this)), [response, option.option])
  }, null, () => {
    util.wxAlert(data.msg || '加载配置失败', 'none', 5000)
  })
}

/**
 * 参数处理
 * @param {object} data 
 */
const handleData = (data) => {
  if (store.isEncode()) {
    data = kwbms(data)
    if (store.isEncrypt()) {
      data = kwfilters(kwencrypts(data))
    }
  }
  return data
}

/**
 * 
 * @param {object} data 
 */
const kwbms = (data) => {
  if (data && typeof data === 'object') {
    for (var i in data) {
      data[i] = kwbm()
    }
  }
  return data
}

// 特殊字符替换正则
const reg = new RegExp('([^\u0000-\u007F^\u0080-\u00FF]|\u00b7|\u44e3)', 'gm')

/**
  * @param {string} str 
 */
const kwbm = (str) => {
  if (store.isEncode() && str) {
    str = str.toString().replace(reg, (a) => {
      return '&#' + a.charCodeAt(0) + ';'
    })
  }
  return str
}

/**
 * @param {object} data 
 */
const kwfilters = (data) => {
  if (data && typeof(data) === 'object') {
    for (var i in data) {
      data[i] = kwfilter(data[i])
    }
  }
  return data
}

/**
 * @param {string} str 
 */
const kwfilter = (str) => {
  if (str) {
    str = str.replace(/\+/g, '_abc123')
      .replace(/-/g, '_def456')
      .replace(/=/g, '_ghi789')
      .replace(/\//g, '_jkl098')
      .replace(/\*/g, '_mno765')
  }
  return str
}

/**
 * @param {string} data 
 */
const kwencrypts = (data) => {
  if (store.isEncrypt() && store.getToken() && data) {
    data = xxteaEncrypt64(data, kwz.token)
  }
  return data
}

// 暴露指定的api
export default {
  get, post, ajaxUrl, initVisit, logout
}

