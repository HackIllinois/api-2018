var _Promise = require('bluebird');

var chai = require('chai');
var sinon = require('sinon');

var errors = require('../api/v1/errors');
var utils = require('../api/v1/utils');
var User = require('../api/v1/models/User.js');
var AuthService = require('../api/v1/services/AuthService.js');

var config = require('../api/config');
var JWT_SECRET = config.auth.secret;
var jwt = require('jsonwebtoken');

var assert = chai.assert;
var expect = chai.expect;

describe('UserService',function(){

    describe('issueForUser',function(){
        var testUser;
        var subject;
        var parameters;
        before(function(done){
            testUser = User.forge({ id: 1, email: 'new@example.com' });
            testUser.related('roles').add({ role: utils.roles.ATTENDEE });

            subject = {
                email: 'new@example.com',
                roles: [ { role: utils.roles.ATTENDEE } ]
            };
            parameters = {
                expiresIn: config.auth.expiration,
                subject: '1'
            };

            done();
        });
        it('issues a token for a valid user',function(done){
            var token = AuthService.issueForUser(testUser);
            expect(token).to.eventually.equal(jwt.sign(subject, JWT_SECRET,parameters)).and.notify(done);
        });
        it('refuses a token for a blank user',function(done){
            try{
                AuthService.issueForUser(new User());
            }catch(e){
                expect(e).to.be.instanceof(TypeError);
                done();
            }
        });
    });

    describe('verify',function(){
        before(function(done){
            testUser = User.forge({ id: 1, email: 'new@example.com' });
            testUser.related('roles').add({ role: utils.roles.ATTENDEE });
            done();
        });
        it('verifies a valid auth token',function(done){
            AuthService.issueForUser(testUser)
                .then(function(token){
                    var verification = AuthService.verify(token);
                    expect(verification).to.eventually.have.deep.property('email','new@example.com').then(function () {
                        expect(verification).to.eventually.have.deep.property('sub', '1').and.notify(done);
                    });
                });
        });
        it('refuses a fake auth token',function(done){
            var token = "FAKE TOKEN"
            var verification = AuthService.verify(token);
            expect(verification).to.eventually.be.rejectedWith(errors.UnprocessableRequestError).and.notify(done);
        });
    });

});