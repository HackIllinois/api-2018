var assert = require('chai').assert;
var chai = require('chai');
var mockery = require('mockery');

var _Promise = require('bluebird');

// To be mocked
var User = null;
var UserService = null;

describe("Initial setup and running tests", function () {
    before(function(done) {
        require('./mocked/index');
        mockery.enable({
            warnOnUnregistered: false,
            useCleanCache: true
        });

        User = require('../models/User');
        UserService = require('../services/UserService');

        done();
    });


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

    it('Should pass all endpoint tests', function (done) {
        require('./user');
        require('./auth');
	done();
    });

    after(function(done) {
        console.log("disable mocking");
        mockery.disable();
        mockery.deregisterAll();
        done();
    });
});
