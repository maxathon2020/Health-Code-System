import Vue from 'vue'
import App from './App.vue'
import './lib/vant'
import util from './lib/util'
import comJs from './module/common'
import './lib/message'
import './service'
import './lib/http'
import store from './store'
import router from './router'
import * as constant from '@/config/constant'

Vue.config.productionTip = false

Vue.prototype.$util = util
Vue.prototype.$comJs = comJs
Vue.prototype.$constant = constant
Vue.prototype.$clone = Vue.$clone = object => JSON.parse(JSON.stringify(object))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
