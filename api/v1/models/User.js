/* jshint esversion: 6 */

var _Promise = require('bluebird');
var bcrypt = _Promise.promisifyAll(require('bcrypt'));
var _ = require('lodash');

const SALT_ROUNDS = 12;

var Model = require('./Model');

var UserRole = require('./UserRole');
var User = Model.extend({
	tableName: 'users',
	idAttribute: 'id',
	hasTimestamps: ['created', 'updated'],
	validations: {
		email: ['required', 'email'],
		password: ['required', 'string']
	},
	roles: function () {
		return this.hasMany(UserRole);
	}
});

/**
 * Finds a user by its ID, joining in its related roles
 * @param  {Number|String} id	the ID of the model with the appropriate type
 * @return {Promise<Model>}		a Promise resolving to the resulting model or null
 */
User.findById = function (id) {
	return User.where({ id: id }).fetch({ withRelated: ['roles'] });
};

/**
 * Finds a user by its email address
 * @param  {String}                     email the email address
 * @return {Promise<User>}      the found user, or null
 */
User.findByEmail = function (email) {
<<<<<<< HEAD
        email = email.toLowerCase();
        return this.collection().query({ where: { email: email } }).fetchOne();
=======
	email = email.toLowerCase();
	return User.where({ email: email }).fetch({ withRelated: ['roles']});
};

/**
 * Creates a new user with the specified parameters and role. The role will be
 * set to active if user creation succeeds. Validation is performed on-save only
 * @param  {String} email    the user's email
 * @param  {String} password the user's raw password
 * @param  {String}	role the string representation of a role from utils.roles
 * @return {Promise<User>}	 the User object with the related roles joined-in
 */
User.create = function (email, password, role) {
	var user = User.forge({ email: email });
	var userRole = UserRole.forge({ role: role, active: true });

	return User
		.transaction(function (t) {
			return user.setPassword(password)
				.then(function (result) {
					return result.save(null, { transacting: t });
				})
				.then(function (result) {
					user = result;

					userRole.set({ userId: user.get('id') });
					return userRole.save(null, { transacting: t });
				})
				.then(function (result) {
					return User.where({ id: user.get('id') }).fetch({ withRelated: ['roles'], transacting: t });
				});
		});
>>>>>>> fddeeedb1fe4f6f171ccb7ba7b40b590b98e0c3b
};

/**
 * Securely sets a user's password without persisting any changes
 * @param {String} password a secure password of up to fifty characters
 * @return {Promise<User>} a Promise resolving to the updated User model
 */
User.prototype.setPassword = function (password) {
<<<<<<< HEAD
        password = crypto.hashWeak(password);
        return bcrypt
                .hashAsync(password, SALT_ROUNDS)
                .bind(this)
                .then(function (p) {
                        return Promise.resolve(this.set({ password: p }));
                });
=======
	return bcrypt
		.hashAsync(password, SALT_ROUNDS)
		.bind(this)
		.then(function (p) {
			return _Promise.resolve(this.set({ password: p }));
		});
>>>>>>> fddeeedb1fe4f6f171ccb7ba7b40b590b98e0c3b
};

/**
 * Retrieves a role from the roles field.
 * @param  {String}	role the string representation of a role from utils.roles
 * @return {UserRole}	 the desired role, or undefined
 */
User.prototype.getRole = function (role) {
	return _.find(this.related('roles').models, function (role) {
		return role.role === role;
	});
};

/**
 * Determines whether or not this user has the specified role
 * @param  {String}	role the string representation of a role from utils.roles
 * @param  {Boolean} activeOnly whether or not the role must be active (default true)
 * @return {Boolean}	  whether or not the user has the role
 * @throws {TypeError}	  when the user is missing its related roles key
 */
User.prototype.hasRole = function (role, activeOnly) {
	if (_.isUndefined(this.related('roles'))) {
		throw new TypeError("The related roles were not fetched with this User");
	}

	var roleMatch = { role: role };
	if (_.isUndefined(activeOnly) || activeOnly) {
		role.active = 1;
	}

	return _.some(this.related('roles').toJSON(), roleMatch);
};

/**
 * The plural form of User#hasRole. Checks if the user has any of the provided roles.
 * @param  {Array}	roles an array of string representations of a role from utils.roles
 * @param  {Boolean} activeOnly whether or not the role must be active (default true)
 * @return {Boolean}	  whether or not the user has any of the specified roles
 * @throws TypeError	  when the user is missing its related roles key
 */
User.prototype.hasRoles = function (roles, activeOnly) {
	var found = false;
	_.forEach(roles, _.bind(function (role) {
		found = found || this.hasRole(role, activeOnly);
	}, this));

	return found;
};

/**
 * Securely determines whether or not a password matches this user's password
 * @param  {String}  password an input of arbitrarily-long length
 * @return {Promise} resolving to a Boolean representing the validity
 * of the provided password
 */
User.prototype.hasPassword = function (password) {
<<<<<<< HEAD
        password = crypto.hashWeak(password);
        return Promise
                .bind(this)
                .then(function() {
                        return bcrypt.compareAsync(password, this.get('password'));
                });
=======
	return _Promise
		.bind(this)
		.then(function() {
			return bcrypt.compareAsync(password, this.get('password'));
		});
>>>>>>> fddeeedb1fe4f6f171ccb7ba7b40b590b98e0c3b
};

/**
 * Serializes this User
 * @return {Object} the serialized form of this User
 */
<<<<<<< HEAD
User.prototype.toJSON = function () {
        return _.omit(this.attributes, ['password']);
};


/**
 * Given a user model, purges the user from the database.
 * For complete removals, use this function instead of User.destroy()
 */
User.prototype.removeAll = function () {
	
=======
User.prototype.serialize = function () {
	var serialized = _.omit(this.attributes, ['password']);

	var roles = this.related('roles');
	serialized.roles = (_.isUndefined(roles)) ? null : roles.serialize();

	return serialized;
>>>>>>> fddeeedb1fe4f6f171ccb7ba7b40b590b98e0c3b
};

module.exports = User;
