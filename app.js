//app.js
import kwz from './dist/kwz/kwz.service'

App({
  onLaunch: function () {
    kwz.initVisit()
  },
  $kwz: kwz
})