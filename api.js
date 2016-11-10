var express = require('express');
var config = require('./api/config');
var database = require('./api/database');
var cache = require('./api/cache');
var logger = require('./api/logging');

config.cwd = process.__dirname;

database.instantiate()
	.then(function () {
		return cache.instance();
	})
	.then(function () {
		var instance = express();
		instance.disable('x-powered-by');

		var api = require('./api/');
		instance.use('/v1', api.v1);

		var instance = instance.listen(config.port, function() {
			logger.info("initialized api (http://localhost:%d)", config.port);
		});
	}).catch(function (err) {
		logger.error(err);
	});