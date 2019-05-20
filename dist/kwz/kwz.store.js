// kwz存储的变量
// 所有变量只能通过set和get方法来访问
// 提供了set方法的才能修改，未提供的均为常量

import util from './kwz.util.js'

// 请求路径
const BASE_URL = 'http://www.dd.com:8080'

// 是否开发者模式
const DEV = true

// 是否使用代理模式
const PROXY = false

// session的cookie名称
const SESSION_NAME = 'JSESSIONID'

// 默认请求头
const REQUEST_DEFAULT_HEADER = {
  'content-type': 'application/x-www-form-urlencoded'
}

// 代理头
const PROXY_TAG = '/api'

/**
 * BASE_URL
 */
const getBaseUrl = () => {
  return BASE_URL
}

/**
 * DEV
 */
const isDev = () => {
  return DEV
}

/**
 * PROXY
 */
const isProxy = () => {
  return PROXY
}

/**
 * SESSION_NAME
 */
const getSessionName = () => {
  return SESSION_NAME
}

/**
 * REQUEST_DEFAULT_HEADER
 */
const getRequestDefaultHeader = () => {
  return util.copyJson(REQUEST_DEFAULT_HEADER)
}

/**
 * PROXY_TAG
 */
const getProxyTag = () => {
  return PROXY_TAG
}

// sessionId
let _sessionId = ''

// token
let _token = ''

// 是否编码
let _jcIsencode = false

// 是否加密
let _jcIsencrypt = false

/**
 * getSessionId
 */
const getSessionId = () => {
  if (!_sessionId) {
    _sessionId = util.getStringFromStorageSync('sessionId')
  }

  return _sessionId
}

/**
 * setSessionId
 * @param {string} id 
 */
const setSessionId = (id) => {
  _sessionId = id
  util.setStringToStorage('sessionId', id)
}

/**
 * 设置相关参数
 * @param {object} data 
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
  return _jcIsencrypt
}

export default {
  getBaseUrl, isDev, isProxy, getSessionName, getRequestDefaultHeader,
  getSessionId, setSessionId, setRelData, isEncode, isEncrypt, getToken, getProxyTag
}