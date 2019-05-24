// kwz工具类

import consts from './kwz.const'

/**
 * 执行函数
 * @param {function} f 需要执行的函数
 * @param {object} target 传入执行函数（包括调用失败时）的this指向
 * @param {array} arg 传入执行函数（包括调用失败时）参数
 * @param {function} ef 函数调用失败（如typeof f !== 'function'或异常错误等等情况)后被执行的函数
 */
const cfp = (f, target, arg, ef) => {
  let flag = false
  if (typeof f === 'function') {
    try {
      f.apply(target || this, arg)
      flag = true
    } catch (e) {
      errorLog(e)
    }
  }
  if (!flag) {
    try {
      if (typeof ef === 'function') {
        ef.apply(target || this, arg)
      }
    } catch (e) {
      errorLog(e)
    }
  }
}

/**
 * 输出错误信息（只有在开发者模式为kwz.const中dev=true的时候才会输出）
 * @param {object} log 
 */
const errorLog = (log) => {
  if (consts.isDev() && console) {
    console.error(log)
  }
}

/**
 * 字符串转json
 * @param {string} str 
 */
const str2Json = (str) => {
  if (typeof str === 'string') {
    try {
      return JSON.parse(str)
    } catch (e) {
      errorLog(e)
    }
  }
  return null
}

/**
 * json转字符串
 * @param {object} json 
 */
const json2Str = (json) => {
  if (typeof json === 'object') {
    try {
      return JSON.stringify(json)
    } catch (e) {
      errorLog(e)
    }
  }
  return null
}

/**
 * json对象复制（注意，不支持function之类的value）
 * @param {object} json 要复制的对象
 * @returns 复制后的对象，失败返回null
 */
const copyJson = (json) => {
  try {
    return str2Json(json2Str(json))
  } catch (e) {
    errorLog(e)
  }
  return null
}

export default {
  cfp, errorLog, str2Json, json2Str, copyJson
}