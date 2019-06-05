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
const getObjectFromStorage = (key, callback, app) => {
  getStringFromStorage(key, (data) => {
    let dataObject = util.str2Json(data)
    util.cfp(callback, app || this, [dataObject])
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
  weixin.setStringToStorage(key, data, callback, app)
}

/**
 * 将json对象值异步设置到缓存中
 * @param {string} key 缓存key
 * @param {object} data 缓存data
 * @param {function} callback 回调函数 () => {...}
 * @param {object} app 回调函数this指向
 */
const setObjectToStorage = (key, data, callback, app) => {
  setStringToStorage(key, util.json2Str(data), callback, app)
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

// 是否登陆
let _isLogin = true

/**
 * 设置相关参数
 * @param {object} data 使用loadConfig返回的数据
 */
const setRelData = (data) => {
  if (data) {
    _token = data.token
    _jcIsencode = data.jc_isencode
    _jcIsencrypt = data.jc_isencrypt
    _isLogin = data.isLogin
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

/**
 * 是否登陆
 */
const isLogin = () => {
  return _isLogin
}

/**
 * 设置是否登陆
 * @param {boolean} login 
 */
const setLogin = (login) => {
  _isLogin = login
}

let _loginUser = null

/**
 * 获取登陆用户信息
 */
const getLoginUser = (callback, app) => {
  if (!_loginUser) {
    getObjectFromStorage('_LOGIN_USER', (loginUser) => {
      _loginUser = loginUser
      util.cfp(callback, app || this, [loginUser])
    })
  } else {
    util.cfp(callback, app || this, [_loginUser])
  }
}

/**
 * 设置登陆用户
 * @param {object} loginUser 
 */
const setLoginUser = (loginUser) => {
  _loginUser = loginUser
  setObjectToStorage('_LOGIN_USER', loginUser)
}

export default {
  getStringFromStorage, getObjectFromStorage, setStringToStorage, setObjectToStorage,
  getSessionId, setSessionId, setRelData, getToken, isEncode, isEncrypt, isLogin, setLogin,
  getLoginUser, setLoginUser
}