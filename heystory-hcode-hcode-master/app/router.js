'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/api/creatUser', controller.home.creatUser);
  router.post('/api/createNft', controller.home.createNft);
  router.post('/api/queryNft', controller.home.queryNft);
  router.post('/api/endorseNft', controller.home.endorseNft);
  router.post('/api/updateNft', controller.home.updateNft);
  router.post('/api/queryNftItem', controller.home.queryNftItem);
};
