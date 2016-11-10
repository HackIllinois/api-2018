var express = require('express');
var database = require('./api/database');
var cache = require('./api/cache');
var config = require('./api/config');
var logger = require('./api/logging');

config.cwd = process.__dirname;

var instance = express();
instance.disable('x-powered-by');

database.instantiate()
	.then(function () {
		return cache.instantiate();
	})
	.then(function (client) {
		var api = require('./api/');
		instance.use('/v1', api.v1);

		instance.listen(config.port, function() {
			logger.info("initialized api (http://localhost:%d)", config.port);
		});
	}).catch(function (err) {
		logger.error(err);
	});


