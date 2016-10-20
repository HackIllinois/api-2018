var chai = require('chai');
var assert = require('chai').assert;
var sinon = require('sinon');

// TODO use sinon and mocked knex object

var _Promise = require('bluebird');

var User = require('./../api/v1/models/User');
var UserService = require('./../api/v1/services/UserService');

/*
var mockFunc = JsMockito.mockFunction(UserService.findUserByEmail);
var tUser = new User();
tUser.attributes.id = 1;
JsMockito.when(mockFunc)(process.env.HACKILLINOIS_SUPERUSER_EMAIL).thenReturn(_Promise.resolve(tUser));
*/

/*Test Services*/
//var mForge = JsMockito.mockFunction(User.forge);

/*
console.log(User.findByEmail);
var User.findByEmail = JsMockito.mockFunction(User.findByEmail);
var tUser = new User();
tUser.attributes.id = 1;
JsMockito.when(mFindByEmail)("test@test.com").thenReturn(_Promise.resolve(tUser));
var mCreate = JsMockito.mockFunction(User.create);
*/

var tUser = new User();
tUser.attributes.id = 1;
//var mockFind = JsMockito.mockFunction(User.findByEmail);
var mockUser = JsMockito.mock(User);
//JsMockito.when(mockFind)("test@test.com").thenReturn(_Promise.resolve(tUser));
//JsMockito.when(mockUserService).require('../models/User').thenReturn(mockFind);
JsMockito.when(mockUser).findByEmail("test@test.com").thenReturn(_Promise.resolve(tUser));
JsMockito.when(mockUserService).require('../models/User').thenReturn(mockUser);
//JsMockito.when(mockUserService).User.findByEmail("test@test.com").thenReturn(_Promise.resolve(tUser));

it('Checking User Services', function(done) {
    /* TODO: Find a better solution rather than waiting */
    setTimeout(function () {
        //mockFunc(process.env.HACKILLINOIS_SUPERUSER_EMAIL)
        mockUserService.createUser("test@test.com","password1","ATTENDEE")
            .then(function(userPromise) {
                console.log("hello");
                //assert.equal(userModel.attributes.id, 1, 'this test should have passed');
                done();
            });
    }, 1000);
});

//JsMockito.when(mFindUserByEmail)(process.env.HACKILLINOIS_SUPERUSER_EMAIL).thenReturn(_Promise.resolve(tUser));

/* Make sure the database has superuser before continuing */
it('Check assumption that SUPERUSER has an id of 1', function(done) {
	/* TODO: Find a better solution rather than waiting */
        setTimeout(function () {
                //mockFunc(process.env.HACKILLINOIS_SUPERUSER_EMAIL)
                  UserService.findUserByEmail(process.env.HACKILLINOIS_SUPERUSER_EMAIL)
                        .then(function(userModel) {
                                assert.equal(userModel.attributes.id, 1, 'Super user\'s id should be 1');
				done();
                        });
        }, 1000);
});

require('./user/index');
require('./auth/index');
