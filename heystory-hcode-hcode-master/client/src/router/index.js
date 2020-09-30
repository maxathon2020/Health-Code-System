import Vue from 'vue'
import comJs from '@/module/common'
import util from '@/lib/util'
import store from '@/store/index'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const originalPlace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return originalPlace.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/scan/:id',
    name: 'scan',
    component: () => import(/* webpackChunkName: "model" */ '@/views/scan')
  },
  {
    path: '/upgrade',
    name: 'upgrade',
    component: () => import(/* webpackChunkName: "model" */ '@/views/upgrade')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: '/',
  routes
})
router.beforeEach((to, from, next) => {
  // 登录拦截和获取实名信息
  if (!store.state.user) {
    const user = comJs.getUserInfo()
    if (!user) {
      Vue.prototype.$showLoading('Initializing...')
      Vue.prototype.$service.conact.creatUser().then(res => {
        if (res && res.code === 200) {
          Vue.prototype.$hideLoading()
          res.data.symbolList = []
          res.data.itemIdList = []
          comJs.setUserInfo(res.data)
          store.commit('setUser', res.data)
          next()
        } else {
          Vue.prototype.$showLoading('Fail, please refresh the page~')
        }
      }).catch(e => {
        console.error(e)
        Vue.prototype.$showLoading('Fail, please refresh the page~')
      })
    } else {
      store.commit('setUser', user)
      store.commit('initSymbolList', user.symbolList)
      store.commit('initItemIdList', user.itemIdList)
      next()
    }
  } else {
    next()
  }
})
export default router
