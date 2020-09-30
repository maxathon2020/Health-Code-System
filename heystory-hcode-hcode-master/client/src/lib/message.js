import Vue from 'vue'
import { Toast } from 'vant'

const wapToast = function (message = '', onClose = function () {}) {
  return Toast({
    message,
    className: 'custom-ui-toast',
    duration: 2000,
    onClose
  })
}

// message
Vue.prototype.$errorMsg = function (message, html) {
  Toast.fail(message)
}

Vue.prototype.$infoMsg = function (message, html) {
  wapToast(message)
}

Vue.prototype.$warningMsg = function (message, html) {
  wapToast(message)
}

Vue.prototype.$successMsg = function (message, html) {
  Toast.success(message)
}

// toast
Vue.prototype.$toast = wapToast

// loading
Vue.prototype.$showLoading = function (message = '') {
  return Toast.loading({
    mask: true,
    forbidClick: true,
    loadingType: 'circular',
    duration: 0,
    className: 'custom-ui-loading',
    message
  })
}
Vue.prototype.$hideLoading = function () {
  Toast.clear()
}

// error handler
function errorHandle (e) {
  if (typeof e === 'string') {
    return wapToast(e)
  } else {
    // console.error(e)
    let msg = e.message || 'Network anomaly'
    return wapToast(msg)
  }
}
Vue.prototype.$errorHandle = errorHandle

export default errorHandle
