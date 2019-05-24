// kwz数据缓存

import weixin from './kwz.weixin'
import util from './kwz.util'

/**
 * 从缓存中异步取出字符串值
 * @param {string} key 缓存key
 * @param {function} callback 回调函数 (data) => {...}
 * @param {object} app 回调函数的this指向
 */
const getStringFromStorage = (key, callback, app) => {
  weixin.getStringFromStorage(key, callback, app)
}

/**
 * 从缓存中异步取出json对象
 * @param {string} key 缓存key
 * @param {function} callback 回调函数 (data) => {...}
 * @param {object} app 回调函数的this指向
 */
const getObjectFromStorage = (callback, app) => {
  getStringFromStorage(key, (data) => {
    let dataObject = str2Json(data)
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
const setStringToStorage = (key, data, callback, app) => {
  setStringToStorage(key, data, callback, app)
}

/**
 * 将json对象值异步设置到缓存中
 * @param {string} key 缓存key
 * @param {object} data 缓存data
 * @param {function} callback 回调函数 () => {...}
 * @param {object} app 回调函数this指向
 */
const setObjectToStorage = (key, data, callback, app) => {
  setStringToStorage(key, toString(data), callback, app)
}

let _sessionId = ''

const SESSIONID_STORAGE_KEY = 'SESSIONID'

const getSessionId = () => {
  if (!_sessionId) {
    try {
      _sessionId = weixin.getStringFromStorageSync(SESSIONID_STORAGE_KEY)
    } catch (e) {
      util.errorLog(e)
    }
  }
  return _sessionId
}

const setSessionId = (sessionId) => {
  _sessionId = sessionId
  try {
    weixin.setStringToStorageSync(SESSIONID_STORAGE_KEY, sessionId) 
  } catch (e) {
    util.errorLog(e)
  }
}

// token
let _token = ''

// 是否编码
let _jcIsencode = false

// 是否加密
let _jcIsencrypt = false

/**
 * 设置相关参数
 * @param {object} data 使用loadConfig返回的数据
 */
const setRelData = (data) => {
  if (data) {
    _token = data.token
    _jcIsencode = data._jc_isencode
    _jcIsencrypt = data._jc_isencrypt
  }
}

/**
 * 获取token
 */
const getToken = () => {
  return _token
}

/**
 * 是否编码
 */
const isEncode = () => {
  return _jcIsencode
}

/**
 * 是否加密
 */
const isEncrypt = () => {
  return _jcIsencrypt && !!_token
}

export default {
  getStringFromStorage, getObjectFromStorage, setStringToStorage, setObjectToStorage,
  getSessionId, setSessionId, setRelData, getToken, isEncode, isEncrypt
}