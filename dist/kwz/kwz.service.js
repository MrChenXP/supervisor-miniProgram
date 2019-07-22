// kwz服务
// kwz的封装方法

// 工具类
import util from './kwz.util'
// 数据缓存
import store from './kwz.store'
// pc端的一些kwz逻辑
import {
    kwbms,
    kwencrypts,
    kwfilters
} from './kwz.pc'
// kwz对微信接口的封装
import weixin from './kwz.weixin'
// kwz常量配置
import consts from './kwz.const'

/**
 * 发送get请求
 * @param {string} url 请求路径
 * @param {object} data 请求参数
 * @param {function} success 成功回调函数
 * @param {object} page 回调函数指向
 * @param {function} fail 失败回调函数
 */
const get = (url, data, success, page, fail) => {
    ajaxUrl({
        url,
        data,
        success,
        page,
        fail,
        type: 'GET'
    })
}

/**
 * 发送post请求
 * @param {string} url 请求路径
 * @param {object} data 请求参数
 * @param {function} success 成功回调函数
 * @param {object} page 回调函数指向
 * @param {function} fail 失败回调函数
 */
const post = (url, data, success, page, fail) => {
    ajaxUrl({
        url,
        data,
        success,
        page,
        fail,
        type: 'POST'
    })
}

// 是否已经初始化=》初始化主要包括请求token
let _ajaxinited = false

/**
 * 加锁ajaxUrl
 * @param {object} option
 */
const ajaxUrl = (option) => {
    let that = this
    if (!_ajaxinited) {
        setTimeout(() => {
            util.cfp(ajaxUrl, that, [option])
        }, 500)
    } else {
        ajaxUrlUnLock(option)
    }
}

/**
 * 未加锁的ajaxUrl
 * @param {object} option 
 */
const ajaxUrlUnLock = (option) => {

    weixin.openLoading()

    const complete = (cb) => {
        return (data, option) => {
            weixin.closeLoading()
            setSession(data)
            util.cfp(cb, (option.page || (option.vue || this)), [data, option.option])
        }
    }

    let ajaxOption = util.copyJson(option)

    // ajaxUrl默认post请求
    ajaxOption.type = ajaxOption.type || 'POST'

    if (ajaxOption.data) {
        ajaxOption.data = handleData(ajaxOption.data)
    }

    ajaxOption = handleUrl(ajaxOption)

    ajaxOption.header = handleHeader(ajaxOption)

    ajaxOption.page = option.page

    ajaxOption.option = option

    ajaxOption.success = ajaxSuccess(option.success || option.then, option.fail)
    ajaxOption.fail = ajaxFail(option.fail || option.catch)
    ajaxOption.complete = complete(option.complete)

    weixin.request(ajaxOption)
}

const ajaxSuccess = (cb, eb) => {
    return (data, option) => {
        // 按照weixin.request的封装，只有当httpcode=200时，才会进入此方法
        let responseData = data.data
        if (responseData && (!responseData.statusCode || responseData.statusCode === '200')) {
            util.cfp(cb, (option.page || (option.vue || this)), [responseData, option, data])
        } else {
            util.cfp(eb, (option.page || (option.vue || this)), [data, option], (data) => {
                weixin.alert(data.msg || '请求失败', 'none', 5000)
            })
        }
    }
}

const ajaxFail = (cb) => {
    return (error, option) => {
        if (error) {
            if (error.statusCode === 401) {
                // token不对或者session丢失
                initVisit(() => {
                    if (option.repeat !== true) {
                        let rOption = util.copyJson(option)

                        rOption.page = option.page
                        rOption.success = option.success
                        rOption.fail = option.fail
                        option.complete = option.complete

                        rOption.repeat = true

                        // 重新请求
                        weixin.request(rOption)

                        return
                    }
                }, option.page)
            } else if (error.statusCode === 402) {
                weixin.alert('无权限进行此项操作', 'none', 5000)
                return
            }
        } else {
            weixin.alert(data.msg || '网络错误', 'none', 5000)
        }
        util.cfp(cb, option.page || (option.vue || this), [error])
    }
}

/**
 * 上传文件，object中如果包含url，则使用url上传，否则默认使用ueditor的上传组件上传
 * @param {object} option 
 */
const uploadImg = (option) => {

    const complete = (cb) => {
        return (data, option) => {
            weixin.closeLoading()
            setSession(data)
            util.cfp(cb, (option.page || (option.vue || this)), [data, option.option])
        }
    }

    let chooseImageOption = util.copyJson(option)

    chooseImageOption.success = (res) => {

        weixin.openLoading('添加中...')

        if (res && res.tempFilePaths) {
            if (res.tempFilePaths.length > 0) {
                let isUeditor = false
                let url = option.url
                // 如果option中没有传url，默认使用ueditor的上传图片支持，（不会有返回附件id）
                if (!url) {
                    isUeditor = true
                    url = consts.getUploadImgUrl()
                }

                let uploadOption = {
                    url,
                    filePath: res.tempFilePaths[0],
                    success: option.success,
                    fail: option.fail,
                    complete,
                    page: option.page
                }

                uploadOption = handleUrl(uploadOption)

                uploadOption.header = handleHeader(option)

                // 因为ueditor返回的内容是字符串，此处转json
                let success = option.success
                option.success = (response, option) => {
                    if (response) {
                        let responseObj

                        if (typeof response === 'string') {
                            responseObj = util.str2Json(response)
                        }

                        // 使用ueditor上传，返回的是字符串
                        if (isUeditor) {
                            if (responseObj && responseObj.url) {
                                responseObj = handleUrl(responseObj, 'uri')
                                responseObj.uri = weixin.formatUrl(responseObj.uri)
                            }
                        }

                        util.cfp(success, option.page || (option.vue || this), [responseObj, option])
                    }
                }

                uploadOption.success = ajaxSuccess(option.success || option.then, option.fail)
                uploadOption.fail = ajaxFail(option.fail || option.catch)
                uploadOption.complete = complete(option.complete)

                weixin.upalodFile(uploadOption)
            }
        } else {
            weixin.alert('选择图片失败')
        }
    }

    chooseImageOption.fail = option.fail

    chooseImageOption.count = 1

    // 选取图片
    weixin.chooseImage(chooseImageOption)

}

/**
 * 处理请求数据，包括加密什么的
 * @param {object} data 
 */
const handleData = (data) => {
    if (store.isEncode()) {
        data = kwbms(data)
        if (store.isEncrypt()) {
            data = kwfilters(kwencrypts(data))
        }
    }
    return data || {}
}

/**
 * 格式化url => 加入token
 * @param {object} option 
 */
const handleUrl = (option, key = 'url') => {
    if (store.getToken()) {
        let url = option.url
        let data = option.data || {}
        // 如果url中没有包含token参数 && 数据请求中没有token
        if (!/^.*(\?|&)token.*$/.test(url) && !data.token) {
            if (url.endsWith('?') || url.endsWith('&')) {
                url += 'token=' + store.getToken()
            } else {
                if (url.indexOf('?') < 0) {
                    url += '?token=' + store.getToken()
                } else {
                    url += '&token=' + store.getToken()
                }
            }
            option[key] = (url.startsWith('/') ? '' : '/') + url
        }
    }
    return option
}

const handleHeader = (option) => {
    let header = (option && option.header) || {}
    header['cookie'] = `${consts.getSessionName()}=${store.getSessionId()}`
    return header
}

/**
 * 记录sessionid
 * @param {object} response 
 */
const setSession = (response) => {
    if (response && response.header && response.header['Set-Cookie']) {
        let cookieArray = response.header['Set-Cookie'].split(';')
        for (let i = 0; i < cookieArray.length; i++) {
            if (cookieArray[i]) {
                let cArray = cookieArray[i].split('=')
                if (cArray[0] && cArray[0].trim() === consts.getSessionName()) {
                    store.setSessionId(cArray[1])
                }
            }
        }
    }
}

/**
 * 初始化配置
 * @param {function} callback 成功后的回调
 * @param {object} page
 */
const initVisit = (callback, page) => {
    weixin.request({
        url: '/visit.jsp',
        success(data) {
            setSession(data)
            initToken(callback, page)
        },
        page,
        header: handleHeader(),
        error(error) {
            weixin.alert(error.msg || '初始化错误-10001')
        }
    })
}

/**
 * 初始化token
 * @param {function} callback 
 * @param {object} page 
 */
const initToken = (callback, page) => {
    let option = {
        url: '/open/app/loadConfig',
        type: 'GET',
        page,
        success(response, option) {
            if (response) {
                _ajaxinited = true
                // 存储加密等数据
                store.setRelData(response.datas)
            }
            util.cfp(callback, (option.page || (option.vue || this)), [response, option.option])
        },
        error(error) {
            util.alert(error.msg || '初始化错误-10002')
        }
    }
    ajaxUrlUnLock(option)
}

/**
 * 缓存文件
 * @param {object} option 
 */
const cacheAttach = (option) => {
    let attachOption = util.copyJson(option)

    if (attachOption.data) {
        attachOption.data = handleData(attachOption.data)
    }

    attachOption = handleUrl(attachOption)

    attachOption.header = handleHeader(attachOption)

    attachOption.success = (filepath) => {
        util.cfp(option.success, option.page || (option.vue || this), [filepath])
    }

    weixin.requestAttach(attachOption)
}

/**
 * 是否登陆
 * @return true/false 是/否
 */
const isLogin = () => {
    return store.isLogin()
}

/**
 * 判断登陆，如果未登陆=》会切换至my tab然后提示登陆
 */
const checkLogin = (success, page) => {
    if (!isLogin()) {
        weixin.switchTab({
            url: '../my/my',
            success() {
                weixin.alert('请登录')
                util.cfp(success, page || this)
            },
            page
        })
    } else {
        return true
    }
}

/**
 * 初始化自动登陆信息
 * @param {function} callback 
 * @param {object} page 
 */
const initAutoLogin = (callback, page) => {
    initLoginUser(callback, page)
    // util.cfp(callback, page || this, [])
}

/**
 * 从后端加载当前登陆用户
 * @param {function} callback 
 * @param {object} page 
 */
const initLoginUser = (callback, page) => {
    ajaxUrl({
        url: '/open/loadInfos',
        then(response) {
            store.setLoginUser(response.datas);
            util.cfp(callback, page || this, [response.datas])
        }
    })
}

/**
 * 退出
 */
const logout = (callback, app) => {
    // 登出操作
    get('/login/open/logout')
    // 清除缓存
    weixin.clearStorage()
    // 设置登陆false
    store.setLogin(false)
    // 重置
    initVisit(() => {
        // 回调
        util.cfp(callback, app || this, [])
    })
}

/**
 * 加载工作区
 */
const initProducts = (callback, page) => {
    getCommonMenus((commonMenus) => {
        // callback
        let retMenus = []

        if (commonMenus && commonMenus._menus_ && commonMenus._menus_.children) {
            // 产品树
            let menus = hasFunc(commonMenus._menus_.children, commonMenus.readPro)
            retMenus.push(...menus)
        }

        util.cfp(callback, this || page, [retMenus])
    }, page)
}

const getCommonMenus = (callback, page) => {
    store.getCommonMenus((commonMenus) => {
        // if (!commonMenus) {
        ajaxUrl({
            url: '/open/loadMenus',
            page,
            success(response) {
                if (response && response.datas) {
                    store.setCommonMenus(response.datas)
                    util.cfp(callback, page || this, [response.datas])
                }
            }
        })
        // } else {
        //   util.cfp(callback, this || page, [commonMenus])
        // }
    }, page)
}

/**
 * from kwz.uniapp.js
 * @param {array} comonProductsTree 
 * @param {array} userReadPro 
 */
const hasFunc = (comonProductsTree = [], userReadPro = []) => {
    let commonMenu = []
    if (comonProductsTree.length > 0) {
        let productConfig = consts.getProductConfig()
        let workspace = productConfig.workspace
        if (typeof userReadPro === 'string') {
            userReadPro = userReadPro.split(',')
        }
        for (let i = 0; i < comonProductsTree.length; i++) {
            for (let j = 0; j < workspace.length; j++) {
                if (comonProductsTree[i].PRO_ID === workspace[j].proId) {
                    let childrenFun = workspace[j].children
                    let comonChildrenFun = comonProductsTree[i].children
                    for (let m = 0; m < childrenFun.length; m++) {
                        for (let n = 0; n < comonChildrenFun.length; n++) {
                            if (childrenFun[m].funId === comonChildrenFun[n].FUN_ID &&
                                userReadPro.length > 0) {
                                for (let k = 0; k < userReadPro.length; k++) {
                                    if (userReadPro[k] === comonChildrenFun[n].PRO_ID) {
                                        comonChildrenFun[n].THUMB = childrenFun[m].icon
                                        comonChildrenFun[n].PRO_MC = childrenFun[m].funMc || comonChildrenFun[n].PRO_MC
                                        comonChildrenFun[n].LINK = childrenFun[m].link
                                        commonMenu.push(comonChildrenFun[n])
                                        break
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return commonMenu
}

/**
 * 加载代码
 * @param {string} dmStr 
 * @param {function} callback 
 * @param {object} page 
 */
const loadDms = (dmStr = '', callback, page) => {
    getDms(dmStr.split(','), callback, page)
}

/**
 * 获取代码
 * @param {array} dmArray 
 * @param {function} callback 
 * @param {object} page 
 */
const getDms = (dmArray, callback, page) => {
    if (dmArray && dmArray.length > 0) {
        store.getDms((dms) => {
            let dmArrayTmp = []
            let dmTmp = {}
            if (!dms) {
                dms = {}
                dmArrayTmp = dmArray
            } else {
                for (let i = 0; i < dmArray.length; i++) {
                    let dmKey = dmArray[i]
                    if (!dms[dmKey]) {
                        dmArrayTmp.push(dmKey)
                    } else {
                        dmTmp[dmKey] = dms[dmKey]
                    }
                }
            }

            if (dmArrayTmp.length < 1) {
                util.cfp(callback, page || this, [util.copyJson(dmTmp)])
            } else {
                ajaxUrl({
                    url: 'jc_dmtab/open/selectDmmxData',
                    data: {
                        DM_CODES: dmArrayTmp.join(',')
                    },
                    success(data) {
                        if (data.statusCode === '200') {
                            let dmsData = data.datas
                            for (var i in dmsData) {
                                dms[i] = dmsData[i]
                                dmTmp[i] = dmsData[i]
                            }
                            store.setDms(dms)
                            util.cfp(callback, page || this, [util.copyJson(dmTmp)])
                        }
                    }
                })
            }
        }, page)
    }
}

/**
 * 获取权限
 * @param {String} url 路径
 * @param {function} callback(e) 回调(参数：是否有权限）
 */
const hasAuth = (url, callback) => {
    if (url) {
        getCommonMenus((commonMenus) => {
            if (commonMenus) {
                if (!commonMenus.writePathList) {
                    commonMenus.writePathList = commonMenus.writePath.split(',')
                }
                let length = commonMenus.writePathList.length
                url = url.trim()
                for (let i = 0; i < length; i++) {
                    if (commonMenus.writePathList[i] == url || (commonMenus.writePathList[i] && commonMenus.writePathList[i].trim() == url)) {
                        callback(true)
                        return
                    }
                }
                callback(false)
            }
        })
    }
}

/**
 * 日期格式化 
 * @param {String} fmt 日期格式
 * @param {function} DefalutDate 传入的时间,不传默认当前系统时间
 */
const formatDate = (fmt = 'yyyy-MM-dd', DefalutDate = new Date()) => {
    let date = new Date(DefalutDate)
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
    }
    return fmt
}

/**
 * html字符串img图片小程序查看 
 * @param {String} html 要更改的html字符串
 */
const formatImg = (html) => {
    let imgSrc = /<img\ssrc="(?:(?!http))/gi;
    let src = "<img src=\"" + consts.getBaseUrl()

    let imgClass = /(<img)/gi
    let classImg = "<img style=\"max-width:100%;\""
    // console.log(html.replace(imgSrc, src))

    if (html) { // 有些时候字段值是空，但依然调用这个方法，故要判断
        html = html.replace(imgSrc, src)

        html = html.replace(imgClass, classImg)
    }
    // console.log(html)

    return html
}

/**
 * 返回当天为基准的指定日期
 * @param {String} impose 参数{y,M,d} M大写是因为后台传来的是大写M
 * @param {function} format 日期格式
 */
const getLimdat = (impose, format) => {
    if (typeof impose !== "object") {
        impose = JSON.parse(impose)
    }
    let _y = parseInt(impose.y)
    let _m = parseInt(impose.M)
    let _d = parseInt(impose.d)
    let date = new Date(Date.parse(new Date((new Date().getFullYear() + _y), (new Date().getMonth()) + _m, new Date().getDate())) + (86400000 * _d))
    date = formatDate(format, date)
    return date
}

/**
 * 返回功能限制的日期参数
 * @param {String} url 功能id
 * @param {function} callback(commonMenus) 回调(菜单)
 */
const dateImpose = (url, callback, page) => {
    store.getCommonMenus((commonMenus) => {
        if (commonMenus) {
            for (let arrs of commonMenus._menus_.children) { // arrs代表每个应用
                for (let arr of arrs.children) { // arr代表应用中的每个功能
                    if (arr.PRO_ID === url) {
                        if (typeof arr.PRO_ATTRS === 'object') { // 没配限制日期返回null,给他加默认前后1年
                            arr.PRO_ATTRS = {
                                minDate: '{"y":"-1","M":"0","d":"0"}',
                                maxDate: '{"y":"1","M":"0","d":"0"}'
                            }
                            callback(arr.PRO_ATTRS)
                        }
                        let proAttrs = JSON.parse(arr.PRO_ATTRS)
                        proAttrs.minDate = typeof proAttrs.minDate === 'undefined' ? '{"y":"-1","M":"0","d":"0"}' : proAttrs.minDate
                        proAttrs.maxDate = typeof proAttrs.maxDate === 'undefined' ? '{"y":"1","M":"0","d":"0"}' : proAttrs.maxDate
                        callback(proAttrs)
                    }
                }
            }
        }
    })
}

/**
 * 数组对象去重
 * @param {String} arr 传入一个数组
 */
const uniq = (arr) => {
    var result = [];
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        if (!obj[arr[i].XQ_XN]) {
            result.push(arr[i]);
            obj[arr[i].XQ_XN] = true;
        }
    }
    return result
}

export default {
    ajaxUrl,
    get,
    post,
    initVisit,
    initToken,
    cacheAttach,
    // 兼容老的写法
    ajax: {
        ajaxUrl
    },
    checkLogin,
    isLogin,
    initAutoLogin,
    setSession,
    logout,
    initProducts,
    cfp: util.cfp,
    getLoginUser: store.getLoginUser,
    setLoginUser: store.setLoginUser,
    loadDms,
    uploadImg,
    canUse: weixin.canUse,
    copyJson: util.copyJson,
    hasAuth,
    formatDate,
    formatImg,
    dateImpose,
    getLimdat,
    uniq
}