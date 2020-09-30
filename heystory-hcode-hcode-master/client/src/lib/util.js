import Cookie from './cookie'
import querystring from './querystring'
import moment from 'moment'

const util = {
  // cookie
  getCookie (name, opt) {
    return Cookie.get(name, opt)
  },

  setCookie (name, value, opt) {
    return Cookie.set(name, value, opt)
  },

  removeCookie (name, opt) {
    return Cookie.remove(name, opt)
  },

  // localstorage
  getStorage (key) {
    return window.localStorage.getItem(key)
  },

  setStorage (key, value) {
    window.localStorage.setItem(key, value)
  },

  removeStorage (key) {
    window.localStorage.removeItem(key)
  },

  queryStringify (obj) {
    obj = obj || {}
    return querystring.stringify(obj)
  },

  queryParse (url) {
    url = url || window.location.search
    return querystring.parse(url)
  },

  formatTimestamp (row, column, cellValue, index) {
    cellValue = Number(cellValue)
    return moment.unix(cellValue).format('Y-MM-DD HH:mm:ss')
  },

  formatString (str, args) {
    if (str === undefined || typeof str !== 'string') {
      return undefined
    }
    if (args === undefined || args === null || typeof args !== 'object') {
      return str
    }
    if (Array.isArray(args)) {
      for (let i = 0; i < args.length; i++) {
        const v = args[i]
        const reg = new RegExp(`({)${i}(})`, 'g')
        str = str.replace(reg, v)
      }
    } else {
      for (const key in args) {
        if (args.hasOwnProperty(key)) {
          const v = args[key]
          const reg = new RegExp(`({${key}})`, 'g')
          str = str.replace(reg, v)
        }
      }
    }
    return str
  },
  sortByKey (data, key, order = 1) {
    return data.slice().sort((a, b) => {
      a = a[key]
      b = b[key]
      return (a === b ? 0 : a > b ? 1 : -1) * order
    })
  }
}

export default util
