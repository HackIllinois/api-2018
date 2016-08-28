var checkit = require('checkit');
var _Promise = require('bluebird');
var _ = require('lodash');

var errors = require('../errors');

var headerValidations = { };
var bodyValidations = { };

var headerRequired = [];
var bodyRequired = [];

var bodyAllowed = [];

// base request class
function Request(headers, body) {
	this.headerValidations = headerValidations;
	this.bodyValidations = bodyValidations;
	this.headerRequired = headerRequired;
	this.bodyRequired = bodyRequired;
	this.bodyAllowed = bodyAllowed;

	this._headers = headers;
	this._body = body;
	this._audited = false;
	this._marshalled = false;
}

Request.prototype.constructor = Request;

Request.prototype._isRaw = function () {
	return (this._body instanceof Buffer || this._body instanceof String);
};

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
 * @throws MissingParameterError when the request is missing a parameter
 * @throws MissingHeaderError when the request is missing a header
 */
Request.prototype.audit = function () {
	var missingHeaders = [];
	var missingParameters = [];

	_.forEach(this.headerRequired, _.bind(function (requiredHeader) {
		if (!_.has(this._headers, requiredHeader.toLowerCase())) {
			missingHeaders.push(requiredHeader);
		}
	}, this));

	if (missingHeaders.length) {
		throw new errors.MissingHeaderError(null, missingHeaders);
	}

	if (_.isUndefined(this._body) || _.isNull(this._body)) {
		var errorDetail = 'The request body could not be parsed';
		throw new errors.UnprocessableRequestError(errorDetail, null);
	}

	if (!this._isRaw()) {
		_.forEach(this.bodyRequired, _.bind(function(requiredParameter) {
			if (!_.has(this._body, requiredParameter))
				missingParameters.push(requiredParameter);
		}, this));

		if (missingParameters.length) {
			throw new errors.MissingParameterError(null, missingParameters);
		}
	}

	this._audited = true;
};

/**
 * Removes any request parameters in the body that are not either required or
 * allowed and set the marshalled flag
 */
Request.prototype.marshal = function () {
	if (this._isRaw()) {
		this._marshalled = true;
		return;
	}

	this._body = _.pick(this._body, _.merge(this.bodyRequired, this.bodyAllowed));
	this._marshalled = true;
};

/**
 * Validates the request body by auditing, marshalling it, and finally
 * running request-specific validations
 * @return {Promise<>} when the validation is complete
 */
Request.prototype.validate = function () {
	if (!this._audited)
		this.audit();
	if (!this.marshalled)
		this.marshal();

	return checkit(this.headerValidations).run(this._headers)
		.bind(this)
		.then(function () {
			if (this._isRaw()) {
				return _Promise.resolve(true);
			}
			return checkit(this.bodyValidations).run(this._body);
		});
};

module.exports = Request;
