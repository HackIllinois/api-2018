/* jshint esversion: 6 */
const _ = require('lodash');
const ctx = require('ctx');
const config = ctx.config();
const logger = require('../../logging');

const ERROR_TYPES = {
  UNCAUGHT: 'UNCAUGHT',
  CLIENT: 'CLIENT',
  UNKNOWN: 'UNKNOWN'
};

// although we won't make use of this now, it might be useful in
// the future (e.g. logging the body in development but not in production)
function _filterBody(body, blacklist) {
  for (const key in body) { // eslint-disable-line guard-for-in
    const value = body[key];
    if (_.isPlainObject(value)) {
      body[key] = _filterBody(value, blacklist);
    }
  }

  return _.omit(body, blacklist);
}

function _acknowledgeRequest(req) {
  return {
    id: req.id,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  };
}

function _makeRequestMetadata(req) {
  return {
    id: req.id,
    user: req.user ? req.user.get('id') : null,
    adminOverRide: req.originUser ? req.originUser : null,
    query: req.query,
    params: req.params,
    body: _filterBody(req.body, config.logs.request.blacklist)
  };
}

function _makeResponseMetadata(req, res) {
  return {
    id: req.id,
    status: res.statusCode,
    body: res.body
  };
}

module.exports.errorTypes = ERROR_TYPES;

module.exports.logRequestReceipt = (req) => {
  logger.debug('received request', _acknowledgeRequest(req));
};

module.exports.logRequest = (req) => {
  logger.debug('qualified request', _makeRequestMetadata(req));
};

module.exports.logResponse = (req, res) => {
  logger.debug('sent response', _makeResponseMetadata(req, res));
};

module.exports.logError = (req, error, status, cause) => {
  const metadata = _makeRequestMetadata(req);
  metadata.cause = cause;
  metadata.error = error;
  metadata.status = status || 500;

  const level = (cause !== ERROR_TYPES.CLIENT) ? 'error' : 'debug';
  logger.log(level, 'an error was thrown', metadata);
};
