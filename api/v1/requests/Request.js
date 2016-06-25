var checkit = require('checkit');
var _ = require('lodash');

var errors = require('../errors');

var validations = {};
var required = [];
var allowed = [];

// base request class
function Request(body) {
	this.validations = validations;
	this.required = required;
	this.allowed = allowed;

	this._body = body;
	this._audited = false;
	this._marshalled = false;
}

Request.prototype.constructor = Request;

/**
 * Provides read-only access to this request's body
 * @return {Object} a request body which may or may not be validated
 */
Request.prototype.body = function () {
	return this._body;
};

/**
 * Ensures that all required parameters are present in the request and sets
 * the audited flag
 * @throws UnprocessableRequestError when the request cannot be parsed
 * @throws MissingParameterError when the request is missing a parameters
 */
Request.prototype.audit = function () {
	var missingParameters = [];

	if (!this._body) {
		var errorDetail = 'The request body could not be parsed';
		throw new errors.UnprocessableRequestError(errorDetail, null);
	}

	_.forEach(this.required, _.bind(function(requiredParameter) {
		if (_.isUndefined(this._body[requiredParameter]))
			missingParameters.push(requiredParameter);
	}, this));

	if (missingParameters.length)
		throw new errors.MissingParameterError(null, missingParameters);

	this._audited = true;
};

/**
 * Removes any request parameters that are not either required or allowed and
 * set the marshalled flag
 */
Request.prototype.marshal = function () {
	this._body = _.pick(this._body, _.merge(this.required, this.allowed));
	this._marshalled = true;
};

/**
 * Validates the request body by auditing, marshalling it, and finally
 * running request-specific validations
 * @return {Promise} resolving to the result of running Checkit's validations
 */
Request.prototype.validate = function () {
	if (!this._audited)
		this.audit();
	if (!this.marshalled)
		this.marshal();

	return checkit(this.validations).run(this._body);
};

module.exports = Request;
