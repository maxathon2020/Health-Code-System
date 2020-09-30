const ENV = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
const apiGroup = {
  contentact: {
    env: {
      mock: 'http://39.108.59.150',
      dev: 'http://192.168.0.102:7001',
      test: 'http://39.108.59.150',
      huidu: 'http://39.108.59.150',
      prod: 'http://39.108.59.150/maxonrow-backend'
    },
    api: {
      creatUser: ['POST', '/api/creatUser'],
      createNft: ['POST', '/api/createNft'],
      queryNft: ['POST', '/api/queryNft'],
      endorseNft: ['POST', '/api/endorseNft']
    }
  }
}

const apiMap = {}
function generate (map, api, server) {
  for (const name in api) {
    if (api.hasOwnProperty(name)) {
      const item = api[name]
      if (Array.isArray(item)) {
        map[name] = server + item[1]
      } else {
        map[name] = {}
        generate(map[name], item, server)
      }
    }
  }
}
for (let key in apiGroup) {
  var map = apiMap[key] = {}
  var _api = apiGroup[key].api
  var _server = apiGroup[key].env[ENV]
  generate(map, _api, _server)
}

export { apiGroup, apiMap }
