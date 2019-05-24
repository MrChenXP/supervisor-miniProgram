// pc端的一些kwz逻辑

// import consts from './kwz.const'

import store from './kwz.store'
import {xxteaEncrypt64} from '../xxtea/xxtea'

const kwbms = (data) => {
  if (data && typeof data === 'object') {
    for (var i in data) {
      data[i] = kwbm(data[i])
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
  if (data && typeof(data) === 'object') {
    for (var i in data) {
      data[i] = kwencrypt(data[i])
    }
  }
  return data
}

/**
 * 
 * @param {object} data 
 */
const kwencrypt = (data) => {
  if (store.isEncrypt() && data) {
    data = xxteaEncrypt64(data, store.getToken())
  }
  return data
}

export {
  kwfilters, kwbms, kwencrypts
}