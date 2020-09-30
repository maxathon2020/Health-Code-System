import Vue from 'vue'

const conactService = {
  creatUser () {
    return Vue.http({
      host: 'contentact',
      api: 'creatUser'
    })
  },
  createNft (data) { // 申请授权
    return Vue.http({
      host: 'contentact',
      api: 'createNft',
      option: {
        data
      }
    })
  },
  endorseNft (data) {
    return Vue.http({
      host: 'contentact',
      api: 'endorseNft',
      option: {
        data
      }
    })
  },
  queryNft (symbol) {
    return Vue.http({
      host: 'contentact',
      api: 'queryNft',
      option: {
        data: {
          symbol
        }
      }
    })
  }
}

export default conactService
