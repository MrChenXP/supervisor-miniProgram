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
 * 从缓存中同步取出字符串值
 * @param {string} key 缓存key
 * @param {function} callback 回调函数 (data) => {...}
 * @param {object} app 回调函数的this指向
 */
const getStringFromStorageSync = (key) => {
  return weixin.getStringFromStorageSync(key)
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
 * 将字符串值同步设置到缓存中
 * @param {string} key 缓存key
 * @param {string} data 缓存data
 */
const setStringToStorageSync = (key, data) => {
  weixin.setStringToStorageSync(key, data)
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

/**
 * 将json对象值同步设置到缓存中
 * @param {string} key 缓存key
 * @param {object} data 缓存data
 */
const setObjectToStorageSync = (key, data) => {
  setStringToStorageSync(key, util.json2Str(data))
}

/**
 * 将json同步取出
 * @param {string} key 
 */
const getObjectFromStorageSync = (key) => {
  return getStringFromStorageSync(key)
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

// product.json
let _product = {}

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
 * 设置product.json
 * @param {object} data 
 */
const setProduct = (data) => {
  _product = JSON.parse(data.product)

  setObjectToStorageSync('_PRODUCT', _product)
}

const getProduct = (data) => {
  if(!_product) {
    _product = getObjectFromStorageSync('_PRODUCT')
  }
  return _product
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
 * @param {function} callback
 * @param {object} app
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
  setObjectToStorageSync('_LOGIN_USER', loginUser)
}

let _commonMenus = null

/**
 * 获取菜单
 * @param {function} callback 
 * @param {object} app 
 */
const getCommonMenus = (callback, app) => {
  if (!_commonMenus) {
    getObjectFromStorage('_COMMON_MENUS', (commonMenus) => {
      _commonMenus = commonMenus
      util.cfp(callback, app || this, [commonMenus])
    })
  } else {
    util.cfp(callback, app || this, [_commonMenus])
  }
}

/**
 * 设置菜单
 * @param {object} commonMenus 
 */
const setCommonMenus = (commonMenus) => {
  _commonMenus = commonMenus
  setObjectToStorage('_COMMON_MENUS', commonMenus)
}

let _dms = null

/**
 * 设置菜单
 * @param {object} commonMenus 
 */
const setDms = (dms) => {
  _dms = dms
  setObjectToStorage('_DMS', _dms)
}

/**
 * 
 * @param {function} callback 
 * @param {object} app 
 */
const getDms = (callback, app) => {
  if (!_dms) {
    getObjectFromStorage('_DMS', (dms) => {
      _dms = dms
      util.cfp(callback, app || this, [dms])
    })
  } else {
    util.cfp(callback, app || this, [_dms])
  }
}

/**
 * 设置域名
 * @param {object} url
 */
const setUrl = (url) =>{
    setObjectToStorageSync('URL',url)
}

/**
 * 获取域名
 */
const getUrl = () => {
    let url =  getObjectFromStorageSync('URL')
    return url
}

const isXzdq = false
/**
 * 设置是否选择了地区 同步
 * @param {Boolean} type
 */
const setIsXzdq = (type) => {
    wx.setStorageSync('IS_XZDQ', type)
}
/**
 * 获取是否选择了地区 同步
 */
const getIsXzdq = () => {
    return wx.getStorageSync('IS_XZDQ') || isXzdq
}

export default {
    getStringFromStorage, getObjectFromStorage, setStringToStorage, setObjectToStorage,
    getSessionId, setSessionId, setRelData, getToken, isEncode, isEncrypt, isLogin, setLogin,
    getLoginUser, setLoginUser, getCommonMenus, setCommonMenus, getDms, setDms, setProduct, getProduct,
    setUrl, getUrl, setIsXzdq, getIsXzdq
}