const config = require('./config');
const logger = require('./logging');
const v1 = require('./v1');

logger.info('starting superuser setup check in the background');

// the following uses the V1 API to ensure that a superuser is present on the
// currently-running instance. we might want to consider a way to do this without
// using version-specific functionality
const User = require('./v1/models/User');
const utils = require('./v1/utils/');

User.findByEmail(config.superuser.email)
	.then((result) => {
		if (!result) {
			return User.create(config.superuser.email, config.superuser.password, utils.roles.SUPERUSER);
		}

		return null;
	});

module.exports = { v1: v1 };