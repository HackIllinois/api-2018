const _ = require('lodash');

const errors = require('../errors');

module.exports = (allowed, isOwner) => {
  if (!_.isArray(allowed)) {
    allowed = [ allowed ];
  }

  return (req, res, next) => {
    if (!req.auth) {
      // there is no auth information, so the requester cannot be allowed
      return next(new errors.UnauthorizedError());
    } else if (req.user.hasRoles(allowed)) {
      return next();
    } else if (isOwner) {
      // the endpoint defined an ownership method
      const result = isOwner(req);

      if (typeof result.then === 'function') {
        // the ownership method is async, so resolve its promise
        result.then((truth) => {
          if (truth) {
            return next();

          }
          return next(new errors.UnauthorizedError());

        })
          .catch((error) => next(error));
      } else if (result) {
        // the ownership method is synchronous (and succeeded)
        return next();
      } else {
        // the ownership method is synchronous (but failed)
        return next(new errors.UnauthorizedError());
      }
    } else {
      return next(new errors.UnauthorizedError());
    }
  };
};
