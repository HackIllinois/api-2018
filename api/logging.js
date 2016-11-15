var winston = require("winston");
var WinstonCloudwatch = require("winston-cloudwatch");

var config = require('./config');
var client = require('./aws');
var files = require('./files');

var TEMP_INSTANCE_ID = 'instanceid';

var transports = [];
if (client.isEnabled && config.isProduction) {
	var cloudwatchTransport = new WinstonCloudwatch({
		logGroupName: config.logs.groupName,
		logStreamName: function() {
			// keeps streams separated by instance and date
			// TODO add instance to string once metadata is available

			var date = new Date().toISOString().split('T')[0];
			return date + '-' + TEMP_INSTANCE_ID;
		},
		awsRegion: 'us-east-1', // TODO switch this to the client.config.region
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
