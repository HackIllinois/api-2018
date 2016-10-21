var assert = require('chai').assert;
var chai = require('chai');
var mockery = require('mockery');
var _Promise = require('bluebird');
var sinon = require('sinon');

var mockedUser = require('./mocked/User.js');

var UserService;
var User;

describe('Unit Tests',function(){

    before(function(done) {
        mockery.enable({
            warnOnUnregistered: false
        });

        UserService = require('../api/v1/services/UserService.js');

        done();
    });

    describe('First test',function(){

        before(function(done){

            User = '../models/User';
            mockery.registerMock(User, mockedUser);

            done();
        });

        it('checks equal',function(done){
            UserService.findUserByEmail('test@test.com')
                .then(function(result){
                    assert.equal(result.attributes.id, 1, 'Super user\'s id should be 1');
                    done();
                });
        });

        after(function(done){
            mockery.deregisterMock(User);
            done();
        });

    });

    after(function(done) {
        console.log("disable mocking");
        mockery.disable();
        mockery.deregisterAll();
        done();
    });
});