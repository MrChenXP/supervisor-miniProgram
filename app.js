//app.js
import kwz from './dist/kwz/kwz.service'
import weixin from './dist/kwz/kwz.weixin'

App({
  onShow: function () {
    kwz.initVisit()
  },
  $kwz: {...kwz, ...weixin}
})

/**
 * Taohuawu peach blossom hut, Peach Peach Blossom Fairy, energy-saving, and the flowers sell drinks. The
 * office office, the office of programmers, programmers write programs, but also take proceedings for rent.
 * 
 *                    _ooOoo_
 *                   o8888888o
 *                   88" . "88
 *                   (| -_- |)
 *                    O\ = /O
 *                ____/`---'\____
 *              .   ' \\| |// `.
 *               / \\||| : |||// \
 *             / _||||| -:- |||||- \
 *               | | \\\ - /// | |
 *             | \_| ''\---/'' | |
 *              \ .-\__ `-` ___/-. /
 *           ___`. .' /--.--\ `. . __
 *        ."" '< `.___\_<|>_/___.' >'"".
 *       | | : `- \`.;`\ _ /`;.`/ - ` : | |
 *         \ \ `-. \_ __\ /__ _/ .-` / /
 * ======`-.____`-.___\_____/___.-`____.-'======
 *                    `=---='
 *
 * .............................................
 *          佛祖保佑             永无BUG
 */