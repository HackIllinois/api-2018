var express = require('express');
var fs = require('fs');

var config = require('./api/config');
var database = require('./api/database');
var logger = require('./api/logging');

var api = require('./api/');

var instance = express();
instance.disable('x-powered-by');

instance.use('/v1', api.v1);

var instance = instance.listen(config.port, function() {
	logger.info("initialized api (http://localhost:%d)", config.port);
});
