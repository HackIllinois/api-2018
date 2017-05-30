const Request = require('./Request');

const bodyRequired = ['project_id', 'mentor_id'];
const bodyValidations = {
	'project_id': ['integer', 'required'],
	'mentor_id': ['integer', 'required'],
};

function ProjectMentorRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

ProjectMentorRequest.prototype = Object.create(Request.prototype);
ProjectMentorRequest.prototype.constructor = ProjectMentorRequest;

module.exports = ProjectMentorRequest;