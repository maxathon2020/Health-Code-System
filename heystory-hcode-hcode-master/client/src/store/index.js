import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    symbolList: [],
    itemIdList: []
  },
  mutations: {
    setUser (state, value) {
      state.user = value
    },
    setSymbolList (state, value) {
      const symbolList = JSON.parse(JSON.stringify(state.symbolList))
      symbolList.push(value)
      state.symbolList = symbolList
    },
    setItemIdList (state, value) {
      const itemIdList = JSON.parse(JSON.stringify(state.itemIdList))
      itemIdList.push(value)
      state.itemIdList = itemIdList
    },
    initSymbolList (state, value) {
      state.symbolList = value
    },
    initItemIdList (state, value) {
      state.itemIdList = value
    }
  },
  actions: {
  },
  modules: {
  }
})
