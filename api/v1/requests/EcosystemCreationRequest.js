var roles = require('../utils/roles');
var Request = require('./Request');

var bodyRequired = ['name'];
var bodyValidations = {
	'name': ['string', 'required', 'maxLength:100']
};

function EcosystemCreationRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

EcosystemCreationRequest.prototype = Object.create(Request.prototype);
EcosystemCreationRequest.prototype.constructor = EcosystemCreationRequest;

module.exports = EcosystemCreationRequest;