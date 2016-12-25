var _Promise = require('bluebird');

var chai = require('chai');
var sinon = require('sinon');

var errors = require('../api/v1/errors');
var utils = require('../api/v1/utils');
var PermissionService = require('../api/v1/services/PermissionService.js');
var User = require('../api/v1/models/User.js');

var assert = chai.assert;
var expect = chai.expect;

var test_allow = function(creatorRole, createdRole, success, done){
    var testUser = User.forge({ id: 1, email: 'new@example.com' });
    testUser.setPassword('password123').then(function () {
        testUser.related('roles').add({ role: creatorRole});
        var allow = PermissionService.canCreateUser(testUser,createdRole);
        if(success)
            expect(allow).to.eventually.equal(true).and.notify(done);
        else
            expect(allow).to.eventually.be.rejectedWith(errors.UnauthorizedError).and.notify(done);
    });
};

describe('PermissionService', function(){
    describe('canCreateUser', function(){
        it('allows creation by SUPERUSER', function(done){
            test_allow(utils.roles.SUPERUSER,"",true,done);
        });
        it('allows creation of COMMON by ORGANIZER', function(done){
            test_allow("ADMIN","MENTOR",true,done);
        });
        it('denies creation of COMMON by non-ORGANIZER', function(done){
            test_allow("MENTOR","MENTOR",false,done);
        });
    });
});