/*jshint esversion: 6 */

var _ = require('lodash');
var EntityNotSupportedError = require('../errors/EntityNotSupportedError');

const CONTENT_TYPE_MISMATCH = "The uploaded content type is not allowed";

module.exports = function(req, res, next) {
	// when the content type does not match, the body parser just leaves the
	// request body empty (as opposed to throwing an error)
	if (_.isEmpty(req.body)) {
		return next(new EntityNotSupportedError(CONTENT_TYPE_MISMATCH));
	}

	next();
};
