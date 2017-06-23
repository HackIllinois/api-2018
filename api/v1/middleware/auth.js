const AuthService = require('../services/AuthService');
const PermissionService = require('../services/PermissionService');
const User = require('../models/User');
const config = require('../../config');
const errors = require('../errors');
const _ = require('lodash');

const AUTH_HEADER = config.auth.header;
const ADMIN_USER_OVERRIDE_HEADER = 'Admin-User-Override';

module.exports = (req, res, next) => {
  const auth = req.header(AUTH_HEADER);

  if (!auth) {
    return next();
  }

  return AuthService.verify(auth)
    .then((decoded) => {
      // specifies that request supplied a valid auth token
      // (but not necessarily that the associated user data has been retrieved)
      req.auth = true;
      return User.findById(decoded.sub);
    })
    .then((user) => {
      const adminUserOverride = req.get('Admin-User-Override');

      if (!_.isUndefined(adminUserOverride) && PermissionService.isOrganizer(user)) {
        return User.findById(adminUserOverride)
          .then((user) => {
            if (_.isNull(user)) {
              const message = 'The provided userId was invalid (' + adminUserOverride + ')';
              const source = ADMIN_USER_OVERRIDE_HEADER;

              return next(new errors.InvalidHeaderError(message, source));
            }

            req.user = user;
            return next();
          });
      }

      req.user = user;
      return next();
    })
    .catch(errors.UnprocessableRequestError, (error) => {
      const message = 'The provided token was invalid (' + error.message + ')';
      const source = AUTH_HEADER;

      return next(new errors.InvalidHeaderError(message, source));
    });
};
