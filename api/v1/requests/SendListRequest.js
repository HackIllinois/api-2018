var Request = require('./Request');

var bodyRequired = ['listName', 'template'];
var bodyValidations = {
	'listName':  ['required', 'string', 'max:255'],
	'template': ['required', 'string', 'max:255']
};

function SendListRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

SendListRequest.prototype = Object.create(Request.prototype);
SendListRequest.prototype.constructor = SendListRequest;

module.exports = SendListRequest;
