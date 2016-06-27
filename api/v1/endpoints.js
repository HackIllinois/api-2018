var requests = require('./requests');

var endpoints = {};

endpoints['/user'] = {
	POST: requests.HackerCreationRequest
};
endpoints['/auth'] = {
	POST: requests.AuthTokenRequest
};

module.exports = endpoints;
