const middleware = require('../middleware');

const router = require('express').Router();

function healthCheck(req, res, next) {
  return next();
}

router.get('', healthCheck);
router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
