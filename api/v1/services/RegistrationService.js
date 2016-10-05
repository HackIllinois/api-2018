var Checkit = require('checkit');
var _Promise = require('bluebird');
var _ = require('lodash');

var Mentor = require('../models/Mentor');
var errors = require('../errors');
var utils = require('../utils');

/**
 * Registers a mentor for the given user with the specified attributes.
 * @param  {Object} attributes the attributes for this mentor registration
 * @param  {Object} user the user for which a mentor will be registered
 * @return {Promise} resolving to the newly-created user
 * @throws InvalidParameterError when a mentor exists for the specified user
 */
module.exports.createMentor = function (attributes, user) {
  var userId = user.get('id');
  attributes['userId'] = userId;
	var mentor = Mentor.forge(attributes);

	return mentor
		.validate()
		.catch(Checkit.Error, utils.errors.handleValidationError)
		.then(function (validated) {
			if (user.hasRole(utils.roles.MENTOR, false)) {
				var message = "The given user has already registered as a mentor";
				var source = "userId";
				throw new errors.InvalidParameterError(message, source);
			}
      return Mentor.transaction( function (t) {
        return UserRole.addRole(user, utils.roles.MENTOR, false, t)
        .then(function (result) {
          return mentor.save(null, { transacting: t });
        });
  		});
		})
		.then(function (result) {
			return _Promise.resolve(result);
		});
};
