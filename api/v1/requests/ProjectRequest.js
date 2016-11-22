var roles = require('../utils/roles');
var Request = require('./Request');

var bodyRequired = ['name', 'description', 'repo', 'isPublished'];
var bodyValidations = {
	'name': ['string', 'required'],
	'description': ['string', 'required'],
	'repo': ['required', 'string', 'maxLength:255'],
	'isPublished': ['boolean']
};

function ProjectRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

ProjectRequest.prototype = Object.create(Request.prototype);
ProjectRequest.prototype.constructor = ProjectRequest;

module.exports = ProjectRequest;