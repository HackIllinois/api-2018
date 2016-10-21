var assert = require('chai').assert;
var chai = require('chai');
var mockery = require('mockery');
var _Promise = require('bluebird');
var sinon = require('sinon');

var UserService;

describe('Unit Tests',function(){

    before(function(done) {

        require('./mocked/index');

        mockery.enable({
            warnOnUnregistered: false
        });

        UserService = require('../api/v1/services/UserService.js');

        done();
    });

    describe('Check User Services',function(){

        describe('Test UserService.findUserByEmail',function(){
            it('finds existing user',function(done){
                UserService.findUserByEmail('valid@example.com')
                    .then(function(result){
                        assert.equal(result.attributes.email,'valid@example.com',"User's email should be the input")
                        assert.equal(result.attributes.id, 1, "User's id should be 1");
                        done();
                    });
            });
            it('searches for non-existent user',function(done){
                UserService.findUserByEmail('invalid@example.com')
                    .then(function(result){
                        throw new errors.ExistsError('Bad null search','email');
                    })
                    .catch(function(e){
                        assert.equal(e.type,'NotFoundError','Invalid email should throw error');
                        done();
                    });
            });
        });

        describe('Test User.Service.createUser',function(){
            it('creates a user',function(done){
                UserService.createUser('create@example.com','password1','ATTENDEE')
                    .then(function(result){
                        assert.equal(result.attributes.email,'create@example.com','Should return user object with passed email');
                        done();
                    });
            });
            it('attempts to create a user that already exists',function(done){
                UserService.createUser('valid@example.com','password1','ATTENDEE')
                    .then(function(result){
                        throw new errors.ExistsError('Bad null search','email');
                    })
                    .catch(function(e){
                        assert.equal(e.type,'InvalidParameterError','Should throw error if user already exists');
                        done();
                    });
            });
        });

        describe('Test User.Service.findUserById',function(){
            it('finds existing user',function(done){
                UserService.findUserById(1)
                    .then(function(result){
                        assert.equal(result.attributes.email,'valid@example.com',"User's email should be the input")
                        assert.equal(result.attributes.id, 1, "User's id should be 1");
                        done();
                    });
            });
            it('searches for non-existent user',function(done){
                UserService.findUserById(2)
                    .then(function(result){
                        throw new errors.ExistsError('Bad null search','email');
                    })
                    .catch(function(e){
                        assert.equal(e.type,'NotFoundError',"Should throw error if user doesn't exists");
                        done();
                    });
            });
        });

    });

    after(function(done) {
        console.log("disable mocking");
        mockery.disable();
        mockery.deregisterAll();
        done();
    });
});