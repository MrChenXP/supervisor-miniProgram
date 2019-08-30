// kwz常量配置

import productConfig from './products'

// 请求路径
const BASE_URL = 'http://www.dd.com:8080'
// const BASE_URL = 'https://app.qgjydd.cn' // 高新网 龙岗

//访问的后缀
const BASE_VISIT = ''  //  空就拿visit.jsp
// const BASE_VISIT = '/visittest' // 测试
// const BASE_VISIT = '/visitlg'  //  龙岗

// session的cookie名称 部署前要看下session名字(visit.jsp看)。因为运维会经常换session名字
const SESSION_NAME = 'JSESSIONID' // 本地
// const SESSION_NAME = 'KSESSIONID1' // 高新 龙岗

// 是否开发者模式
const DEV = true

// 是否使用代理模式
const PROXY = false

// 代理头
const PROXY_TAG = '/api'

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
 * 获取请求的域名后缀
 */
const getBaseVisit = () => {
    return BASE_VISIT
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

/**
 * 获取产品配置信息
 */
const getProductConfig = () => {
    return productConfig
}

const UPLOAD_URL_IMG = '/ueditor/jsp/controller.jsp?action=uploadimage'

/**
 * 获取Ueditor的上传路径
 */
const getUploadImgUrl = () => {
    return UPLOAD_URL_IMG
}

export default {
    getBaseUrl, getBaseVisit, isDev, isProxy, getProxyTag, getSessionName, getDefaultRequestHeader, getProductConfig, getUploadImgUrl
}