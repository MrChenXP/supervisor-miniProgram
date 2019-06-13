// kwz常量配置

// 请求路径
const BASE_URL = 'http://www.dd.com:8080'

// 是否开发者模式
const DEV = true

// 是否使用代理模式
const PROXY = false

// 代理头
const PROXY_TAG = '/api'

// session的cookie名称
const SESSION_NAME = 'JSESSIONID'

// 默认请求头
const DEFAULT_REQUEST_HEADER = {
  'content-type': 'application/x-www-form-urlencoded'
}

/**
 * 获取请求的域名
 */
const getBaseUrl = () => {
    return BASE_URL
}

/**
 * 是否开发者模式
 */
const isDev = () => {
    return DEV
}

/**
 * 路径请求是否使用代理
 */
const isProxy = () => {
    return !!PROXY
}

/**
 * 获取代理路径
 */
const getProxyTag = () => {
    return PROXY_TAG
}

/**
 * 获取服务端的sessionid名称
 */
const getSessionName = () => {
    return SESSION_NAME
}

/**
 * 获取需要自定义添加的请求头（副本）
 */
const getDefaultRequestHeader = () => {
    return JSON.parse(JSON.stringify(DEFAULT_REQUEST_HEADER))
}

import productConfig from './products'

/**
 * 获取产品配置信息
 */
const getProductConfig = () => {
    return productConfig
}

const UPLOAD_URL_IMG = '/ueditor/jsp/controller.jsp?action=uploadimage'

/**
 * 获取上传路径
 */
const getUploadImgUrl = () => {
    return UPLOAD_URL_IMG
}

export default {
    getBaseUrl, isDev, isProxy, getProxyTag, getSessionName, getDefaultRequestHeader, getProductConfig, getUploadImgUrl
}