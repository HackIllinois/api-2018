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
            it('checks with valid email',function(done){
                UserService.findUserByEmail('valid@email.com')
                    .then(function(result){
                        //console.log(result.attributes);
                        assert.equal(result.attributes.email,'valid@email.com','User\'s email should be the input')
                        assert.equal(result.attributes.id, 1, 'User\'s id should be 1');
                        done();
                    });
            });
            it('checks with invalid email',function(done){
                UserService.findUserByEmail('invalid@email.com')
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
            it('checks for user creation with valid email',function(done){
                UserService.createUser('create@email.com','password1','ATTENDEE')
                    .then(function(result){
                        assert.equal(result.attributes.email,'create@email.com','Should return user object with passed email');
                        done();
                    });
            });
            it('checks for user creation failure with invalid email',function(done){
                UserService.createUser('valid@email.com','password1','ATTENDEE')
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
            it('checks for finding user with valid id',function(done){
                UserService.findUserById(1)
                    .then(function(result){
                        assert.equal(result.attributes.email,'valid@email.com','User\'s email should be the input')
                        assert.equal(result.attributes.id, 1, 'User\'s id should be 1');
                        done();
                    });
            });
            it('checks for find failure with invalid id',function(done){
                UserService.findUserById(2)
                    .then(function(result){
                        throw new errors.ExistsError('Bad null search','email');
                    })
                    .catch(function(e){
                        assert.equal(e.type,'NotFoundError','Should throw error if user doesn\'t exists');
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