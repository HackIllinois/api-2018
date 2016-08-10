var requests = require('./requests');

var endpoints = {};

endpoints['/v1/user'] = {
	POST: requests.HackerUserCreationRequest
};
endpoints['/v1/user/accredited'] = {
	POST: requests.AccreditedUserCreationRequest
};
endpoints['/v1/auth'] = {
	POST: requests.AuthTokenRequest
};
endpoints['/v1/upload/resume'] = {
	POST: requests.UploadRequest
};
endpoints['/v1/upload/resume/:id'] = {
	PUT: requests.UploadRequest
};

module.exports = endpoints;
