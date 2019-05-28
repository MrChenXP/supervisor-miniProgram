//app.js
import kwz from './dist/kwz/kwz.service'
import weixin from './dist/kwz/kwz.weixin'

App({
  onShow: function () {
    kwz.initVisit()
  },
  $kwz: {...kwz, ...weixin}
})