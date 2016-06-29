var config = require('./config');
var logger = require('./logging');

var v1 = require('./v1');

logger.info("starting superuser setup check in the background");

// the following uses the V1 API to ensure that a superuser is present on the
// currently-running instance. we might want to consider a way to do this without
// using version-specific functionality
var User = require('./v1/models/User');
var utils = require('./v1/utils/');

User.query().where('Email', config.superuser.email).select('id')
	.then(function (results) {
		if (!results.length) {
			var superuser = User.forge({ email: config.superuser.email, role: utils.roles.SUPERUSER});
			return superuser.setPassword(config.superuser.password);
		}

		return null;
	})
	.then(function (user) {
		if (user) {
			return user.save();
		}
		return null;
	});

module.exports = { v1: v1 };
