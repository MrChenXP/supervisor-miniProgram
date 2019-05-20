// kwz.ajax
import util from './kwz.util.js'
import store from './kwz.store.js'


/**
 * ajax请求
 * @param {object} option {url, data, type, dataType, header, success, fail, complete}
 */
const ajax = (option) => {
  if (option && util.canIUse('request')) {
    let url, method, data, dataType, header
    if (typeof option === 'object') {
      // 如果传的参数为json对象，
      url = option.url
      method = option.type
    } else if (typeof option === 'string') {
      // 如果参数为字符串
      url = option
    }
    // 请求方式=》默认get
    method = (method || 'GET').toUpperCase()
    if (method === 'GET') {
      // get请求
      url = formatGet(url, option)
    } else if (method === 'POST') {
      // 处理url
      url = formatUrl(url)
      // post请求
      data = formatPostData(option)
    }
    // 默认请求数据类型是json
    dataType = dataType || 'json'
    // 格式化请求头=》默认带上cookie头
    header = formatRequestHeader(option)
    wx.request({
      url, method, data, dataType, header,
      // 成功方法（微信官方：只有请求返回就会执行，不管httpcode）
      success(response) {
        ajaxSuccess(response, option)
      },
      // 请求失败方法（如果请求没有回来会执行）
      fail(response) {
        ajaxFail(response, option)
      },
      // 请求完成执行方法
      complete(response) {
        ajaxComplete(response, option)
      }
    })
  }
}

/**
 * 将option中data格式化至url
 * @param {string} url 
 * @param {object} option 
 * @returns 格式化后的url
 */
const formatGet = (url, option) => {
  let urlArray = [formatUrl(url)]
  if (option && option.data) {
    let data = option.data
    let paramArray = []
    for (let i in data) {
      paramArray.push('&')
      paramArray.push(i)
      paramArray.push('=')
      paramArray.push(data[i])
    }

    if (paramArray.length > 0) {
      if (url.indexOf('?') < 0) {
        urlArray.push('?')
        paramArray.shift()
      } else if (url.endsWith('&') || url.endsWith('?')) {
        paramArray.shift()
      }
      urlArray.push(...paramArray)
    }
  }
  return urlArray.join('')
}

/**
 * 处理post请求参数
 * @param {object} option 
 * @returns 返回处理后的参数
 */
const formatPostData = (option) => {
  let data = {}
  if (option && option.data) {
    data = option.data
  }
  return data
}

/**
 * 获取ajax请求头
 * @param {object} option 
 */
const formatRequestHeader = (option) => {
  let defaultHeader = store.getRequestDefaultHeader()
  if (option && option.header) {
    for (let i in option.header) {
      defaultHeader[i] = option.header[i]
    }
  }
  defaultHeader['Cookie'] = getCookieHeader()
  return defaultHeader
}

/**
 * 成功回调
 * @param {object} data ajax返回的response
 * @param {object} option 请求参数
 */
const ajaxSuccess = (data, option) => {
  if (data && data.statusCode === 200) {
    if (option) {
      util.cfp(option.success, option.app || (option.vue || this), [data, option])
    }
  } else {
    ajaxFail(data, option)
  }
}

/**
 * 失败回调
 * @param {object} data ajax返回的response
 * @param {object} option 请求参数
 */
const ajaxFail = (data, option) => {
  if (option) {
    util.cfp(option.fail, (option.app || (option.vue || this)), [data, option])
  }
}

/**
 * 请求完成回调
 * @param {object} data ajax返回的response
 * @param {object} option 请求参数
 */
const ajaxComplete = (data, option) => {
  if (option) {
    util.cfp(option.complete, (option.app || (option.vue || this)), [data, option])
  }
}

/**
 * 对url的处理：判断proxy标志，如果当前处于proxy状态，默认在路径前加/api
 * @param {string} url 
 */
const formatUrl = (url) => {
  return store.getBaseUrl() + (store.isProxy() ? store.getProxyTag() : '') + (url.startsWith('/') ? '' : '/') + url
}

/**
 * 获取sessionid的cookie字符串
 */
const getCookieHeader = () => {
  return store.getSessionName() + '=' + store.getSessionId()
}

export default ajax
