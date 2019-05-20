//app.js
import kwz from './dist/kwz/kwz.mp.js'

// 扩展$kwz支持
const originalPage = Page

Page = function (config) {
  config.$kwz = kwz
  return originalPage(config)
}

App({
  onLaunch: function () {
    kwz.initVisit()
  }
})