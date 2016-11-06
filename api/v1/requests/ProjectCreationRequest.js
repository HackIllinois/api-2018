var roles = require('../utils/roles');
var Request = require('./Request');

var bodyRequired = ['name', 'description', 'repo', 'is_published'];
var bodyValidations = {
	'name': ['string', 'required'],
	'description': ['string', 'required'],
	'repo': ['string', 'maxLength:255'],
	'is_published': ['boolean']
};

function ProjectCreationRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

ProjectCreationRequest.prototype = Object.create(Request.prototype);
ProjectCreationRequest.prototype.constructor = ProjectCreationRequest;

module.exports = ProjectCreationRequest;