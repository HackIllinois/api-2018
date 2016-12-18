var winston = require("winston");
var WinstonCloudwatch = require("winston-cloudwatch");

var config = require('./config');
var files = require('./files');

var transports = [];
if (config.isProduction && config.aws.enabled) {
	var cloudwatchTransport = new WinstonCloudwatch({
		logGroupName: config.logs.groupName,
		logStreamName: config.logs.streamPrefix + '/' + config.logs.groupName + '/' + config.id,
		awsRegion: config.aws.defaults.region,
		json: true
	});

	// add other transports as needed
	transports.push(cloudwatchTransport);
} else {
	var fileTransport = new winston.transports.File({
		filename: files.initializeLogfile()
	});

	// add other transports as needed
	transports.push(fileTransport);
}


var logger = new winston.Logger({ transports: transports });
logger.info("prepared environment for %s", config.environment);

module.exports = logger;
