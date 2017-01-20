var bodyParser = require('body-parser');
var _Promise = require('bluebird');

var services = require('../services');
var middleware = require('../middleware');
var requests = require('../requests');
var roles = require('../utils/roles');


var router = require('express').Router();

function _isAuthenticated (req) {
    return req.auth && (req.user !== undefined);
}





router.use(bodyParser.json());
router.use(middleware.auth);
