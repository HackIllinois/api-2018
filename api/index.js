const v1 = require('./v1');
const User = require('./v1/models/User');
const utils = require('./v1/utils/');



let v1Obj;

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
  if (!v1Obj) {
    v1Obj = {v1: v1};
  }

  return v1Obj;
}
