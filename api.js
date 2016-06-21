var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');

var config = require('./api/config');
var database = require('./api/database');
var logger = require('./api/logging');
var v1 = require('./api/v1/');

var api = express();
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));
api.disable('x-powered-by');

api.use('/v1', v1);

var instance = api.listen(config.port, function() {
	logger.info("initialized api (http://localhost:%d)", config.port);
});

module.exports = api;
