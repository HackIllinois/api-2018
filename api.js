var express = require('express');
var bodyParser = require('body-parser');
var logger = require('winston');

// set up the api instance and its versioned components
var api = express();
var v1 = require('./api/v1/');

// add middleware
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));

var env = api.get('env');
var isDevelopment = env === 'development';

// TODO handle global configuration access
// TODO log warning when in development mode
// TODO handle global not-found error as 404

// generic development error handler (with stack trace)
if (api.get('env') === 'development') {
  api.use(function(err, req, res, next) {
	// TODO: send back err.message as trace using
	// appropriate service/middleware
  });
}

// generic production error handler (no stack trace)
api.use(function(err, req, res, next) {
  // TODO: send back error using appropriate service/middleware
});

// set the versioned components' routes
api.use('/v1', v1);

// TODO use global configuration here
var port = 8080;
var instance = api.listen(port, function() {
	logger.info("Instance available on port %d", port);
});

module.exports = api;
