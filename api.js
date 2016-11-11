var express = require('express');

var config = require('./api/config');
var database = require('./api/database');
var cache = require('./api/cache');
var logger = require('./api/logging');

// the dirname is local to every module, so we expose the app root's cwd
// here (before initializing the api)
config.cwd = process.__dirname;

var instance = express();
instance.disable('x-powered-by');

database.instantiate()
	.then(function () {
		return cache.instantiate();
	})
	.then(function () {
		//api is initialized here which assures that all modules have access to an initialized datastore and cache instance
		var api = require('./api/');
		instance.use('/v1', api.v1);

		instance.listen(config.port, function() {
			logger.info("initialized api (http://localhost:%d)", config.port);
		});
	}).catch(function (err) {
		logger.error(err);
	});


