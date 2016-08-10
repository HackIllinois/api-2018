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
		}

		if (isOwner) {
			// the endpoint defined an ownership method
			var result = isOwner(req);

			if ('function' === typeof result.then) {
				// the ownership method is async, so resolve its promise
				result.then(function (truth) {
					if (!truth) {
						next(new errors.UnauthorizedError());
					} else {
						next();
					}
				})
				.catch(function (error) {
					next(error);
				});
			} else if (!result) {
				// the ownership method is synchronous (but failed)
				return next(new errors.UnauthorizedError());
			} else {
				// the ownership method is synchronous (and succeeded)
				next();
			}
		}
		else if (!_.includes(allowed, req.auth.role)) {
			// the endpoint did not define an ownership method, and the
			// requester did not have the role necessary to continue
			return next(new errors.UnauthorizedError());
		} else {
			// the requester is authorized
			next();
		}
	};
};
