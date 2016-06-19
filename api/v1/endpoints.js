var endpoints = {};

endpoints['/user'] = {
	POST: {
		required: ['email', 'password', 'confirmedPassword']
	}
};
endpoints['/auth'] = {
	POST: {
		required: ['email', 'password']
	}
};

module.exports = endpoints;
