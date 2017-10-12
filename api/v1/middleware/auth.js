const AuthService = require('../services/AuthService');
const User = require('../models/User');
const errors = require('../errors');
const roles = require('../utils/roles');
const _ = require('lodash');

module.exports = (ctx) => {
    return (req, res, next) => {
      let config = ctx.config();
      let logger = ctx.logger();
      let auth = req.get(config.auth.headers.all);
      if (auth) {
        auth = _.split(auth, ' ', 2);
      } else {
        return next();
      }

      if (auth[0] == config.auth.types.bearer) {
        return AuthService.getGitHubAccountDetails(auth[1])
          .then((handle) => {
            req.auth = true;
            return User.findByGitHubHandle(handle);
          })
          .then((user) => {
            req.user = user;
            return next();
          })
          .catch(errors.UnprocessableRequestError, (error) => {
            const message = 'The provided token was invalid (' + error.message + ')';
            const source = config.auth.headers.all + ': ' + config.auth.types.bearer;

            return next(new errors.InvalidHeaderError(message, source));
          });
      } else if (auth[0] == config.auth.types.basic) {
        return AuthService.verify(auth[1])
          .then((decoded) => {
            // specifies that request supplied a valid auth token
            // (but not necessarily that the associated user data has been retrieved)
            req.auth = true;
            return User.findById(decoded.sub);
          })
          .then((user) => {
            const adminUserOverride = req.get(config.auth.headers.impersonation);

            if (!_.isUndefined(adminUserOverride) && user.hasRole(roles.SUPERUSER)) {
              return User.findById(adminUserOverride)
                .then((impersonated) => {
                  if (_.isNull(impersonated) || impersonated.hasRole(roles.SUPERUSER)) {
                    const message = 'The provided userId was invalid (' + adminUserOverride + ')';
                    const source = config.auth.headers.impersonation;

                    return next(new errors.InvalidHeaderError(message, source));
                  }

                  logger.debug('Impersonation: %d %d at %s with %s %s',
                    user.get('id'),
                    impersonated.get('id'),
                    new Date(),
                    req.method,
                    req.originalUrl
                  );

                  req.user = impersonated;
                  req.originUser = user.get('id');
                  return next();
                });
            }

            req.user = user;
            return next();
          })
          .catch(errors.UnprocessableRequestError, (error) => {
            const message = 'The provided token was invalid (' + error.message + ')';
            const source = config.auth.headers.all + ': ' + config.auth.types.basic;

            return next(new errors.InvalidHeaderError(message, source));
          });
      }

      return next();
    }
}
