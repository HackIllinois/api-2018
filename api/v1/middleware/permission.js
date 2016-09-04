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

    else if (_.includes(allowed, req.auth.role)) {
      next();
    }

    else if (isOwner) {
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

    else {
      return next(new errors.UnauthorizedError());
    }
	};
};
