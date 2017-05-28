var winston = require('winston');

var config = require('./config');

var transports = [];
var consoleTransport = new winston.transports.Console({
	colorize: !config.isProduction,
	prettyPrint: !config.isProduction,
	stringify: config.isProduction,
	json: config.isProduction
});

// add other transports as needed
transports.push(consoleTransport);

var logger = new winston.Logger({
	transports: transports
});
logger.info('prepared environment for %s', config.environment);

module.exports = logger;
