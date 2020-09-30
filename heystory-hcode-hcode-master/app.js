const AlipaySdk = require('alipay-sdk').default
const fs = require('fs')

module.exports = app => {
  app.beforeStart(async () => {
    // 将 AlipaySdk 实例挂载到 app 上
    app.alipaySdk = new AlipaySdk({
      appId: '2019062665676191',
      privateKey: fs.readFileSync('./rsa_private_key.pem', 'ascii'),
    })
  })
}
