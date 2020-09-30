'use strict';

module.exports = appInfo => {
  const config = exports = {}

  // 自定义日志路径
  config.logger = {
    dir: `./logs/${appInfo.name}`
  }

  config.outputPath = './qz-attachment'

  return config
}