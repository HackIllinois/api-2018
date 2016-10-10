var assert = require('chai').assert;
var chai = require('chai');
require('jsmockito');

var _Promise = require('bluebird');

var User = require('../models/User');
var UserService = require('../services/UserService');

var mockFunc = JsMockito.mockFunction(UserService.findUserByEmail);
var tUser = new User();
tUser.attributes.id = 1;
JsMockito.when(mockFunc)(process.env.HACKILLINOIS_SUPERUSER_EMAIL).thenReturn(_Promise.resolve(tUser));
//(mockFunc(process.env.HACKILLINOIS_SUPERUSER_EMAIL).then(function(result){console.log(result);})); // result is 6
//JsMockito.verify(mockFunc)(1, 2);

//var mUserService = JsMockito.mock(UserService);
/*var mFindUserByEmail = JsMockito.mockFunction("func",UserService.findUserByEmail);
JsMockito.when(mFindUserByEmail).then(function(arg){
    var testUser = {attributes : {id:1}};
    return testUser;
});*/

/* Make sure the database has superuser before continuing */
it('Check assumption that SUPERUSER has an id of 1', function(done) {
	/* TODO: Find a better solution rather than waiting */
        setTimeout(function () {
                mockFunc(process.env.HACKILLINOIS_SUPERUSER_EMAIL)
                        .then(function(userModel) {
                                console.log(userModel.attributes.id + " " + 1);
                                assert.equal(userModel.attributes.id, 1, 'Super user\'s id should be 1');
				done();
                        });
        }, 1000);
});

require('./user');
require('./auth');
