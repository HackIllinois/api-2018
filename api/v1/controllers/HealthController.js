var bodyParser = require('body-parser');
var middleware = require('../middleware');

var router = require('express').Router();

router.use(bodyParser.json());
router.use(middleware.request);

router.get('/', function(req, res) {
    res.send();
});

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;