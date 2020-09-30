import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import { apiGroup } from '@/config/api'
import util from '@/lib/util'
import comJs from '@/module/common'
import message from '@/lib/message'
import { getStatusText } from 'http-status-codes'

/**
 * 自定义http请求方法，统一处理请求数据，配合config/api接口配置，调用方法：this.$service(opt)
 * @param host String 请求域名，和config/api对应
 * @param api String 接口名，和config/api对应，格式为 'login'、'contract.apply'
 * @param option Object axios接口配置，可以覆盖默认值
 * @param withToken Boolean 是否携带token 默认是false
 * @param redirect Boolean 未登录是否跳转到登录页
 * @param showError Boolean 显示错误信息 默认是false
 * @param isMock Boolean 使用mock服务器
 * @param contentType String 默认是form，支持json，formdata
 * @param urlKey Array|Object url格式化数据
 * @returns axios promise
 */

const ENV = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'

const getValue = function (obj, key) {
  let mapkey = key.split('.')
  let rlt = obj[mapkey[0]]
  if (rlt === undefined) {
    return rlt
  }
  for (let i = 1; i < mapkey.length; i++) {
    let deep = rlt[mapkey[i]]
    if (deep === undefined) {
      return deep
    } else {
      rlt = deep
    }
  }
  return Array.isArray(rlt) ? rlt : undefined
}

function http (opt) {
  if (opt === undefined || typeof opt !== 'object' || opt === null || Array.isArray(opt)) {
    opt = {}
  }

  var errorHandle = function (txt, p = true) {
    if (opt.showError) message(txt)
    if (p) {
      return Promise.reject(new Error(txt))
    }
  }

  if (opt.api === undefined || opt.host === undefined) {
    return errorHandle('调用参数错误')
  }

  const hostname = apiGroup[opt.host]
  const url = hostname && getValue(hostname.api, opt.api)
  if (hostname === undefined || url === undefined) {
    return errorHandle('接口未定义')
  }

  if (opt.urlKey) {
    url[1] = util.formatString(url[1], opt.urlKey)
  }
  var baseURL = hostname.env[ENV]
  if (opt.isMock && hostname.env.mock) {
    baseURL = hostname.env.mock
  }

  // 默认参数
  opt.contentType = opt.contentType || 'form'
  opt.option = opt.option || {}
  const defaultParam = {
    baseURL,
    url: url[1],
    method: url[0],
    timeout: 60000
  }

  const mergeParam = Object.assign({}, defaultParam, opt.option)
  mergeParam.headers = mergeParam.headers || {}

  // 登录鉴权
  if (opt.withToken) {
    const userinfo = comJs.isLogin()
    if (userinfo) {
      Object.assign(mergeParam.headers, {
        'Authorization': 'Bearer ' + userinfo.token
      })
    } else {
      if (opt.redirect) {
        return router.push({ name: 'login', query: { redirect: opt.redirect } })
      } else {
        return errorHandle('请先登录')
      }
    }
  }

  // 设置请求体格式为form
  if (opt.contentType === 'form' && mergeParam.method.toLowerCase() === 'post') {
    mergeParam.headers['Content-Type'] = mergeParam.headers['Content-Type'] || 'application/x-www-form-urlencoded'
    if (mergeParam.data) {
      mergeParam.data = util.queryStringify(mergeParam.data)
    }
  }
  // 设置请求体格式为formdata
  if (opt.contentType === 'formdata' && mergeParam.method.toLowerCase() === 'post') {
    mergeParam.headers['Content-Type'] = mergeParam.headers['Content-Type'] || 'multipart/form-data'
  }

  return new Promise((resolve, reject) => {
    axios(mergeParam)
      .then(response => {
        let data = response.data
        let config = response.config
        if (data.code === 401) {
          comJs.removeLoginCookie()
          if (opt.redirect) {
            router.push({ name: 'login', query: { redirect: opt.redirect } })
          }
        }
        if (opt.debug) {
          console.log(`-----------接口调用-----------`)
          console.log(`${response.config.url}`)
          if (config.data) {
            console.log(`-----------data参数-----------`)
            console.log(util.queryParse(config.data))
          }
          if (config.params) {
            console.log(`-----------params参数-----------`)
            console.log(config.params)
          }
          console.log('-----------响应结果-----------')
          console.log(data)
        }
        resolve(data)
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 401) {
            comJs.removeLoginCookie()
            error.message = '请先登录'
            if (opt.redirect) {
              router.push({ name: 'login', query: { redirect: opt.redirect } })
            }
          } else {
            error.message = getStatusText(error.response.status)
          }
        } else if (error.request) { // 请求已发送但没有收到响应，error.request为XMLHttpRequest的引用
          error.message = 'Network anomaly'
        }
        errorHandle(error.message, false)
        reject(error)
      })
  })
}

Vue.prototype.$axios = Vue.axios = axios
Vue.prototype.$http = Vue.http = http
