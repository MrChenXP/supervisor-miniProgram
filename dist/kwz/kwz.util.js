// kwz的工具类

/**
 * 是否可以使用微信的接口
 * 具体使用见官方：https://developers.weixin.qq.com/miniprogram/dev/api/wx.canIUse.html
 * @param {string} key api名称
 * @returns 是否可以使用 true/false
 */
const canIUse = (key) => {
  if (wx.canIUse(key)) {
    return true
  } else {
    errorLog(`${key} is not support in current weixin version`)
  }
  return false
}

/**
 * 执行函数
 * @param {function} f 需要执行的函数
 * @param {object} target 传入执行函数（包括调用失败时）的this指向
 * @param {array} arg 传入执行函数（包括调用失败时）参数
 * @param {function} ef 函数调用失败（如typeof f !== 'function'或异常错误等等情况)后被执行的函数
 */
const cfp = (f, target, arg, ef) => {
  let runFlag = true
  if (typeof f === 'function') {
    try {
      f.apply(target || this, arg)
      runFlag = false
    } catch (e) {
      errorLog(e)
    }
  }
  if (runFlag) {
    try {
      if (runFlag && typeof ef === 'function') {
        ef.apply(target || this, arg)
      }
    } catch (e) {
      errorLog(e)
    }
  }
}

// 是否dev
let _dev = false

/**
 * @param {boolean} dev 
 */
const setDev = (dev) => {
  _dev = dev
}

/**
 * 参照dev标记打印错误日志
 * @param {string} log 打印的内容
 */
const errorLog = (log) => {
  if (_dev && console) {
    console.error(log)
  }
}

/**
 * 字符串转json
 * @param {string} string 要转json的字符串
 * @returns 转换后的json，失败返回null
 */
const toJson = (string) => {
  if (string && typeof string === 'string') {
    try {
      return JSON.parse(string)
    } catch (e) {
      errorLog(e)
    }
  }
  return null
}

/**
 * json转字符串
 * @param {object} json 要转字符串的json对象
 * @returns 转换后的字符串，失败返回null
 */
const toString = (json) => {
  if (json && typeof json === 'object') {
    try {
      return JSON.stringify(json)
    } catch (e) {
      errorLog(e)
    }
  }
  return null
}

/**
 * 从缓存中异步取出字符串值
 * @param {string} key 缓存key
 * @param {function} callback 回调函数 (data) => {...}
 * @param {object} app 回调函数的this指向
 */
const getStringFromStorage = (key, callback, app) => {
  if (canIUse('getStorage') && key) {
    wx.getStorage({
      key,
      success (res) {
        cfp(callback, app || this, [res.data])
      }
    })
  }
}

/**
 * 从缓存中同步取出字符串值
 * @param {string} key 缓存key
 * @returns 返回storage内的数据，失败返回null
 */
const getStringFromStorageSync = (key) => {
  if (canIUse('getStorageSync') && key) {
    return wx.getStorageSync(key)
  }
  return null
}

/**
 * 从缓存中异步取出json对象
 * @param {string} key 缓存key
 * @param {function} callback 回调函数 (data) => {...}
 * @param {object} app 回调函数的this指向
 */
const getObjectFromStorage = (key = '', callback, app) => {
  getStringFromStorage(key, (data) => {
    let dataObject = toJson(data)
    cfp(callback, app || this, [dataObject])
  }, app)
}

/**
 * 将字符串值异步设置到缓存中
 * @param {string} key 缓存key
 * @param {string} data 缓存data
 * @param {function} callback 回调函数 () => {...}
 * @param {object} app 回调函数this指向
 */
const setStringToStorage = (key = '', data = '', callback, app) => {
  if (canIUse('setStorage')) {
    wx.setStorage({
      key, data,
      success () {
        cfp(callback, app || this, [])
      }
    })
  }
}

/**
 * 将json对象值异步设置到缓存中
 * @param {string} key 缓存key
 * @param {object} data 缓存data
 * @param {function} callback 回调函数 () => {...}
 * @param {object} app 回调函数this指向
 */
const setObjectToStorage = (key = '', data, callback, app) => {
  setStringToStorage(key, toString(data), callback, app)
}

/**
 * json对象复制（注意，不支持function之类的value）
 * @param {object} json 要复制的对象
 * @returns 复制后的对象，失败返回null
 */
const copyJson = (json) => {
  let jsonStr = toString(json)
  if (jsonStr) {
    return toJson(jsonStr)
  }
  return null
}

/**
 * 微信原生的弹窗提示
 * @param {string} content 弹窗内容
 * @param {string} type 弹窗类型，只支持('success'(default) | 'loading')
 */
const wxAlert = (content, type = 'none', duration = 1500) => {
  if (canIUse('showToast')) {
    wx.showToast({
      title: content,
      icon: type,
      duration
    })
  }
}

/**
 * 微信原生loadding,需调用 wxCloseLoadding 关闭
 * @param {string} content loading框显示的内容，'加载中'(default)
 */
const wxOpenLoadding = (content = '加载中') => {
  if (canIUse('showLoading')) {
    wx.showLoading({
      title: content, 
      mask: true 
    })
  }
}

/**
 * 关闭微信的原生loading
 * @param {function} callback 回调函数
 * @param {object} app 回调函数this指向
 */
const wxCloseLoadding = (callback, app) => {
  if (canIUse('hideLoading')) {
    wx.hideLoading({
      complete () {
        cfp(callback, app || this)
      }
    })
  }
}

export default {
  canIUse, cfp, toString, toJson, getStringFromStorage, getStringFromStorageSync, getObjectFromStorage, setStringToStorage, setObjectToStorage, copyJson, wxAlert, setDev, wxOpenLoadding, wxCloseLoadding
}