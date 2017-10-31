const User = require('./v1/models/User');
const utils = require('./v1/utils/');
const v1 = require('./v1');

module.exports = function(ctx) {
  let config = ctx.config();
  let logger = ctx.logger();

  logger.info('starting superuser setup check in the background');
  // the following uses the V1 API to ensure that a superuser is present on the
  // currently-running instance. we might want to consider a way to do this without
  // using version-specific functionality
  User.findByEmail(config.superuser.email)
    .then((result) => {
      if (!result) {
        return User.create(config.superuser.email, config.superuser.password, utils.roles.SUPERUSER);
      }

      return null;
    });

  return {v1: v1};
}
