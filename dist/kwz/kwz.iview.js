// kwz的iview相关支持

import util from './kwz.util.js'

const { $Toast } = require('../iview/base/index.js')


/**
 * 成功弹窗提示
 */
const alertSuccess = (content) => {
  alert(content, 'success')
}

/**
 * 失败弹窗提示
 */
const alertError = (content) => {
  alert(content, 'error')
}

/**
 * 警告弹窗提示
 */
const alertWarning = (content) => {
  alert(content, 'warning')
}

/**
 * iview的toast type对应的微信type配置表
 */
const TYPE_ALERT_WXALERT = {
  error: 'none',
  warning: 'none'
}

/**
 * 弹窗提示
 */
const alert = (content, type) => {
  util.cfp(() => {
    let option = { content }
    if (type) {
      option.type = type
    }
    $Toast(option)
  }, null, [], () => {
    // 如果调用view的弹窗失败，那就调用微信原生的弹窗
    util.wxAlert(content, TYPE_ALERT_WXALERT[type] || type)
  })
}

// loading 支持
const loading = {
  // 打开
  open (content = '加载中') {
    util.cfp(() => {
      let option = { content, type: 'loading' }
      $Toast(option)
    }, null, [], () => {
      // 如果调用view的loadding失败，那就调用微信原生的loadding弹窗
      util.wxLoadding(content)
    })
  },
  // 关闭
  close (callback, app) {
    util.cfp(() => {
      $Toast().hide()
      util.cfp(callback, app || this)
    }, null, [], () => {
      // 如果调用view的loadding失败，那就调用微信原生的loadding弹窗
      util.wxCloseLoadding(callback, app)
    })
  }
}

export default {
  alertSuccess, alertError, alertWarning, alert, loading
}