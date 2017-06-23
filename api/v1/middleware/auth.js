const AuthService = require('../services/AuthService');
const User = require('../models/User');
const config = require('../../config');
const errors = require('../errors');
const roles = require('../utils/roles');
const _ = require('lodash');
const logger = require('../../logging');

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

      if (!_.isUndefined(adminUserOverride) && user.hasRole(roles.SUPERUSER)) {
        return User.findById(adminUserOverride)
          .then((impersonated) => {
            if (_.isNull(impersonated) || impersonated.hasRole(roles.SUPERUSER)) {
              const message = 'The provided userId was invalid (' + adminUserOverride + ')';
              const source = ADMIN_USER_OVERRIDE_HEADER;

              return next(new errors.InvalidHeaderError(message, source));
            }

            logger.info('Impersonation: %d %d at %s with %s %s',
              user.get('id'),
              impersonated.get('id'),
              new Date(),
              req.method,
              req.originalUrl
            );

            req.user = impersonated;
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
