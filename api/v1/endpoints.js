var requests = require('./requests');

var endpoints = {};

endpoints['/v1/user'] = {
	POST: requests.BasicAuthRequest
};
endpoints['/v1/user/accredited'] = {
	POST: requests.AccreditedUserCreationRequest
};
endpoints['/v1/user/reset'] = {
	POST: requests.ResetTokenRequest
};
endpoints['/v1/registration/mentor'] = {
	POST: requests.MentorRequest,
	PUT: requests.MentorRequest
};
endpoints['/v1/registration/mentor/:id'] = {
	PUT: requests.MentorRequest
};
endpoints['/v1/registration/attendee'] = {
	POST: requests.AttendeeRequest,
	PUT: requests.AttendeeRequest
};
endpoints['/v1/registration/attendee/:id'] = {
	PUT: requests.AttendeeRequest
};
endpoints['/v1/auth/reset'] = {
	POST: requests.ResetPasswordRequest
};
endpoints['/v1/auth'] = {
	POST: requests.BasicAuthRequest
};
endpoints['/v1/upload/resume'] = {
	POST: requests.UploadRequest
};
endpoints['/v1/upload/resume/:id'] = {
	PUT: requests.UploadRequest
};

module.exports = endpoints;
