/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1551345594737_5593';

  // add your middleware config here
  config.middleware = [
    'historyApi',
  ];

  config.historyApi = {
    index: '/',
    whiteList: [ '^/api' ],
  };

  config.view = {
    defaultViewEngine: 'nunjucks',
    defaultExtension: '.html',
    mapping: {
      '.html': 'nunjucks',
    },
  }

  config.security = {
    csrf: false,
  }

  config.cors = {
    credentials: true,
    // origin: '*',
    origin: ctx => ctx.get('origin'),
  }

  config.screenshot = {
    apiPath: 'http://39.108.59.150/eproof',
  }

  config.outputPath = '/www/web/qz-backend/app_files/attachment'

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
