var bodyParser = require('body-parser');
var middleware = require('../middleware');

var router = require('express').Router();

function healthCheck(req, res, next) {
    next();
    return null;
}

router.use(bodyParser.json());
router.use(middleware.auth);
router.use(middleware.request);

router.get('', healthCheck);
router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;