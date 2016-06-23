var checkit = require('checkit');
var _ = require('lodash');

var errors = require('../errors');

var validations = {};
var required = [];
var allowed = [];

function Request(body) {
	this.body = body;
	this.validations = validations;
	this.required = required;
	this.allowed = allowed;

	this._audited = false;
	this._marshalled = false;
}

Request.prototype.constructor = Request;

Request.prototype.audit = function () {
	var missingParameters = [];

	if (!this.body) {
		var errorDetail = 'The request body could not be parsed';
		throw new errors.UnprocessableRequestError(errorDetail, null);
	}

	_.forEach(this.required, _.bind(function(requiredParameter) {
		if (_.isUndefined(this.body[requiredParameter]))
			missingParameters.push(requiredParameter);
	}, this));

	if (missingParameters.length)
		throw new errors.MissingParameterError(null, missingParameters);

	this.audited = true;
};

Request.prototype.marshal = function () {
	this.body = _.pick(this.body, _.merge(this.required, this.allowed));
	this.marshalled = true;
};

Request.prototype.validate = function () {
	if (!this._audited)
		this.audit();
	if (!this.marshalled)
		this.marshal();

	return checkit(this.validations).run(this.body);
};

module.exports = Request;
