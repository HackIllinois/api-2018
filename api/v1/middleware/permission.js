var _ = require('lodash');

var errors = require('../errors');
var UserService = require('../services/UserService');

module.exports = function(allowed, isOwner) {
	if (!_.isArray(allowed))
		allowed = [allowed];

	return function (req, res, next) {
		if (!req.auth)
			return next(new errors.UnauthorizedError());
		if (isOwner && !isOwner(req))
			return next(new errors.UnauthorizedError());
		if (!isOwner && !_.includes(allowed, req.auth.role))
			return next(new errors.UnauthorizedError());

		next();
	};
};
