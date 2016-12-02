var express = require('express');

var config = require('./api/config');
var database = require('./api/database');
var logger = require('./api/logging');

// the dirname is local to every module, so we expose the app root's cwd
// here (before initializing the api)
config.cwd = process.__dirname;

var instance = express();
instance.disable('x-powered-by');

var api = require('./api/');
instance.use('/v1', api.v1);

var instance = instance.listen(config.port, function() {
    logger.info("initialized api (http://localhost:%d)", config.port);
});
