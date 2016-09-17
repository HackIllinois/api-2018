var assert = require('chai').assert;
var chai = require('chai');

var User = require('../models/User');
var UserService = require('../services/UserService');

/* Make sure the database has superuser before continuing */
it('Check assumption that SUPERUSER has an id of 1', function(done) {
	/* TODO: Find a better solution rather than waiting */
        setTimeout(function () {
                UserService.findUserByEmail(process.env.HACKILLINOIS_SUPERUSER_EMAIL)
                        .then(function(userModel) {
                                assert.equal(userModel.attributes.id, 1, 'Super user\'s id should be 1');
				done();
                        });
        }, 1000);
});

require('./user');
require('./auth');
