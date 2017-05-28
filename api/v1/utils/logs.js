/* jshint esversion: 6 */
var _ = require('lodash');

var logger = require('../../logging');

// eslint-disable-next-line no-unused-vars
const REQUEST_BLACKLIST = ['password'];
const ERROR_TYPES = {
    UNCAUGHT: 'UNCAUGHT',
    CLIENT: 'CLIENT',
    UNKNOWN: 'UNKNOWN',
};

// although we won't make use of this now, it might be useful in
// the future (e.g. logging the body in development but not in production)
// eslint-disable-next-line no-unused-vars
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
    return { id: req.id, method: req.method, url: req.originalUrl };
}

function _makeResponseMetadata (req, res) {
    return { id: req.id, status: res.statusCode };
}

module.exports.errorTypes = ERROR_TYPES;

module.exports.logRequest = function (req) {
    logger.debug('received request', _makeRequestMetadata(req));
};

module.exports.logResponse = function (req, res) {
    logger.debug('sent response', _makeResponseMetadata(req, res));
};

module.exports.logError = function (req, error, status, cause) {
    var metadata = _makeRequestMetadata(req);
    metadata.cause = cause;
    metadata.error = error;
    metadata.status = status || 500;

    var level = (cause !== ERROR_TYPES.CLIENT) ? 'error' : 'debug';
    logger.log(level, 'an error was thrown', metadata);
};
