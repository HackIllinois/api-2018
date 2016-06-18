var errors = require('../errors');
var UserService = require('../services/UserService');

module.exports.create_hacker = function (req, res, next) {
	if (req.body.password !== req.body.confirmedPassword){
		var detail = "Passwords do not match";
		var source = "confirmedPassword";

		return next(new errors.InvalidParameterError(detail, source));
	}

	UserService
		.create_user(req.body.email, req.body.password, 'HACKER')
		.then(function (user) {
			// TODO create a JWT here
			next();
		})
		.catch(function (error) {
			next(error);
		});
};
