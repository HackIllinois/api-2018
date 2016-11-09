var aws = require('aws-sdk');

var config = require('./config');

function _isEnabled (aws) {
	return !!aws.config.credentials.accessKeyId;
}

// initially try to build the credentials object using the shared credentials
aws.config.credentials = new aws.EC2MetadataCredentials();
aws.isEnabled = _isEnabled(aws);

if (!aws.isEnabled) {
	// otherwise try to set things up with the local profile
	aws.config.credentials = new aws.SharedIniFileCredentials({ profile: config.profile });
	aws.isEnabled = _isEnabled(aws);
}

module.exports = aws;
