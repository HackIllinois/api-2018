var _Promise = require('bluebird');

var chai = require('chai');
var sinon = require('sinon');

var errors = require('../api/v1/errors');
var utils = require('../api/v1/utils');
var PermissionService = require('../api/v1/services/PermissionService.js');
var User = require('../api/v1/models/User.js');

var assert = chai.assert;
var expect = chai.expect;

describe('PermissionService', function(){
    describe('canCreateUser', function(){
        it('allows creation by SUPERUSER', function(done){
            var testUser = User.forge({ id: 1, email: 'new@example.com' });
            testUser.setPassword('password123').then(function () {
                testUser.related('roles').add({ role: utils.roles.SUPERUSER});
                var allow = PermissionService.canCreateUser(testUser);
                expect(allow).to.eventually.equal(true).and.notify(done);
           });
        });
        it('allows creation of COMMON by ORGANIZER', function(done){
            var testUser = User.forge({ id: 1, email: 'new@example.com' });
            testUser.setPassword('password123').then(function () {
                testUser.related('roles').add({ role: "ADMIN"});
                var allow = PermissionService.canCreateUser(testUser,'MENTOR');
                expect(allow).to.eventually.equal(true).and.notify(done);
            });
        });
        it('denies creation of COMMON by non-ORGANIZER', function(done){
            var testUser = User.forge({ id: 1, email: 'new@example.com' });
            testUser.setPassword('password123').then(function () {
                testUser.related('roles').add({ role: "MENTOR"});
                var allow = PermissionService.canCreateUser(testUser,'MENTOR');
                expect(allow).to.eventually.be.rejectedWith(errors.UnauthorizedError).and.notify(done);
            });
        });
    });
});