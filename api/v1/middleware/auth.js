const AuthService = require('../services/AuthService');
const User = require('../models/User');
const config = require('../../config');
const errors = require('../errors');
const StatusCodeError = require('request-promise/errors').StatusCodeError;
const roles = require('../utils/roles');
const _ = require('lodash');
const logger = require('../../logging');

const API_AUTH_HEADER = config.auth.headers.api;
const GITHUB_AUTH_HEADER = config.auth.headers.github;
const ADMIN_USER_OVERRIDE_HEADER = config.auth.headers.impersonation;

module.exports = (req, res, next) => {
  const auth = req.header(API_AUTH_HEADER);
  const oauth = req.header(GITHUB_AUTH_HEADER);

  if(oauth) {
    return AuthService.getGitHubAccountDetails(oauth)
    .then((handle) => {
      req.auth = true;
      return User.findByGitHubHandle(handle);
    })
    .then((user) => {
      req.user = user;
      return next();
    })
    .catch(StatusCodeError, (error) => {
      const message = 'The provided token was invalid (' + error.message + ')';
      const source = GITHUB_AUTH_HEADER;

      return next(new errors.InvalidHeaderError(message, source));
    });
  } else if(auth) {
    return AuthService.verify(auth)
    .then((decoded) => {
      // specifies that request supplied a valid auth token
      // (but not necessarily that the associated user data has been retrieved)
      req.auth = true;
      return User.findById(decoded.sub);
    })
    .then((user) => {
      const adminUserOverride = req.get(ADMIN_USER_OVERRIDE_HEADER);

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
      const source = API_AUTH_HEADER;

      return next(new errors.InvalidHeaderError(message, source));
    });
  }

  return next();
};
