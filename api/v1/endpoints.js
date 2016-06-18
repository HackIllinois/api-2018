var endpoints = {};

endpoints['/user/hacker'] = {
	POST: {
		required: ['email', 'password', 'confirmedPassword']
	}
};

module.exports = endpoints;
