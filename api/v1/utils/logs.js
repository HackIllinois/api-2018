/* esversion: 6 */
var _ = require('lodash');

var logger = require('../../logging');

var REQUEST_BLACKLIST = ['password'];

// TODO perhaps we should also filter out 'auth' keys, as they hold the user's auth
// token.
function _filterBody (body, blacklist) {
	for (var key in body) {
		var value = body[key];
		if (_.isPlainObject(value)) {
			body[key] = _filterBody(value, blacklist);
		}
	}

	return _.omit(body, blacklist);
}

function _makeRequestMetadata (req) {
	return { id: req.id, method: req.method, url: req.url, body: _filterBody(req.body, REQUEST_BLACKLIST)};
}

module.exports.logRequest = function (req) {
	logger.info("recieved request", _makeRequestMetadata(req));
};

module.exports.logResponse = function (req, res) {
	logger.info("sending response", { id: req.id, body: res.body, status: res.status });
};

module.exports.logError = function (req, error, status, cause) {
	var metadata = _makeRequestMetadata(req);
	metadata.cause = cause;
	metadata.error = error;
	metadata.status = status || 500;

	logger.error(metadata);
};
