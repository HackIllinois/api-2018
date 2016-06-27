var _ = require('lodash');

var errors = require('../errors');
var UserService = require('../services/UserService');

module.exports = function(allowed, isOwner) {
	if (!_.isArray(allowed)) {
		allowed = [allowed];
	}

	return function (req, res, next) {
		if (!req.auth) {
			// there is no auth information, so the requester cannot be allowed
			return next(new errors.UnauthorizedError());
		} if (isOwner && !isOwner(req)) {
			// the endpoint defined a method for determining whether the
			// requester owns the resource, but this was not true
			return next(new errors.UnauthorizedError());
		} if (!isOwner && !_.includes(allowed, req.auth.role)) {
			// the endpoint did not define an ownership method, and the
			// requester did not have the role necessary to continue
			return next(new errors.UnauthorizedError());
		}

		// the requester must be authorized by this point
		next();
	};
};
