var _Promise = require('bluebird');

var chai = require('chai');
var sinon = require('sinon');

chai.use(require('chai-as-promised'));
var assert = chai.assert;
var expect = chai.expect;

var errors = require('../api/v1/errors');
var UserService = require('../api/v1/services/UserService.js');
var User = require('../api/v1/models/User.js');


// TODO move these to separate file
describe('UserService',function(){
    var UserStub;

    before(function (done) {
        var testUser = User.forge({ id: 1, email: 'valid@example.com', password: 'password1' });
        UserStub = sinon.stub(User,'findByEmail');
        UserStub.withArgs('valid@example.com').returns(_Promise.resolve(testUser));
        UserStub.withArgs(sinon.match.string).returns(_Promise.resolve(null));
        UserStub.withArgs(sinon.match.any).throws("TypeError");
        done();
    });

    describe('findUserByEmail',function() {
        it('finds an existing user', function (done) {
            var user = UserService.findUserByEmail('valid@example.com');
            expect(user).to.eventually.have.deep.property("attributes.id", 1);
            expect(user).to.eventually.have.deep.property("attributes.email", 'valid@example.com').and.notify(done);
        });
        it('throws an error for non-existent user', function (done) {
            var user = UserService.findUserByEmail('invalid@example.com');
            expect(user).to.eventually.be.rejectedWith(errors.NotFoundError).and.notify(done);
        });
    });

    // TODO finish refactoring these tests
    // describe('createUser',function(){
    //     it('creates a user',function(done){
    //         UserService.createUser('create@example.com','password1','ATTENDEE')
    //             .then(function(result){
    //                 assert.equal(result.attributes.email,'create@example.com','Should return user object with passed email');
    //                 done();
    //             });
    //     });
    //     it('attempts to create a user that already exists',function(done){
    //         UserService.createUser('valid@example.com','password1','ATTENDEE')
    //             .then(function(result){
    //                 throw new errors.ExistsError('Bad null search','email');
    //             })
    //             .catch(function(e){
    //                 assert.equal(e.type,'InvalidParameterError','Should throw error if user already exists');
    //                 done();
    //             });
    //     });
    // });
    //
    // describe('findUserById',function(){
    //     it('finds existing user',function(done){
    //         UserService.findUserById(1)
    //             .then(function(result){
    //                 assert.equal(result.attributes.email,'valid@example.com',"User's email should be the input")
    //                 assert.equal(result.attributes.id, 1, "User's id should be 1");
    //                 done();
    //             });
    //     });
    //     it('searches for non-existent user',function(done){
    //         UserService.findUserById(2)
    //             .then(function(result){
    //                 throw new errors.ExistsError('Bad null search','email');
    //             })
    //             .catch(function(e){
    //                 assert.equal(e.type,'NotFoundError',"Should throw error if user doesn't exists");
    //                 done();
    //             });
    //     });
    // });
    //
    // describe('verifyPassword',function(){
    //     it('verifies correct password',function(done){
    //         var email = 'password@example.com';
    //         var password = 'password1';
    //         var tUser = User.forge({email: email, password: password});
    //         UserService.verifyPassword(tUser, password)
    //             .then(function(result){
    //                 assert.equal(result, true, "Password should match");
    //                 done();
    //             });
    //     });
    //     it('verifies correct response for incorrect password',function(done){
    //         var email = 'password@example.com';
    //         var password = 'password1';
    //         var tUser = User.forge({email: email, password: password});
    //         UserService.verifyPassword(tUser, 'wrongPassword')
    //             .then(function(result){
    //                 throw new errors.ExistsError('Password should not match','email');
    //             })
    //             .catch(function(e){
    //                 assert.equal(e.type, 'InvalidParameterError', "Incorrect password should throw error");
    //                 done();
    //             });
    //     });
    // });

    after(function(done) {
        UserStub.restore();
        done();
    });
});