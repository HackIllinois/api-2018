var endpoints = {};

endpoints['/user/'] = {
	POST: {
		required: ['email', 'password', 'confirmedPassword']
	}
};

module.exports = endpoints;
