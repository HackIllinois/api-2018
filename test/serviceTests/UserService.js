var _Promise = require('bluebird');

var chai = require('chai');
var sinon = require('sinon');

chai.use(require('chai-as-promised'));
var assert = chai.assert;
var expect = chai.expect;

var errors = require('../../api/v1/errors');
var UserService = require('../../api/v1/services/UserService.js');
var User = require('../../api/v1/models/User.js');

describe('UserService',function(){
    var UserStub;

    before(function (done) {

        var testUser = User.forge({ id: 1, email: 'valid@example.com'});
        emailStub = sinon.stub(User,'findByEmail');
        emailStub.withArgs('valid@example.com').returns(_Promise.resolve(testUser));
        emailStub.withArgs(sinon.match.string).returns(_Promise.resolve(null));
        emailStub.withArgs(sinon.match.any).throws("TypeError");

        idStub = sinon.stub(User,'findById');
        idStub.withArgs(1).returns(_Promise.resolve(testUser));
        idStub.withArgs(sinon.match.number).returns(_Promise.resolve(null));
        idStub.withArgs(sinon.match.any).throws("TypeError");

        var testUser2 = User.forge({ id: 1, email: 'create@example.com'});
        createStub = sinon.stub(User,'create');
        createStub.withArgs('create@example.com').returns(_Promise.resolve(testUser2.setPassword("password1")));
        createStub.withArgs(sinon.match.string).returns(_Promise.resolve(null));
        createStub.withArgs(sinon.match.any).throws("TypeError");

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
    describe('createUser',function(){
        it('creates a user',function(done){
            var user = UserService.createUser('create@example.com','password1','ATTENDEE');
            expect(user).to.eventually.have.deep.property("attributes.email",
                'create@example.com','Should return user object with passed email');
            expect(user).to.eventually.not.have.deep.property("attributes.password",
                'password1','Password should be hashed (different from input');
            done();
        });
        it('throws error after attempting to create an existing user',function(done){
            var user = UserService.createUser('valid@example.com','password1','ATTENDEE');
            expect(user).to.eventually.be.rejectedWith(errors.InvalidParameterError).and.notify(done);
        });
    });

    describe('findUserById',function(){
        it('finds existing user',function(done){
            var user = UserService.findUserById(1);
            expect(user).to.eventually.have.deep.property("attributes.id", 1,"ID should 1, the searched for ID");
            expect(user).to.eventually.have.deep.property("attributes.email",
                'valid@example.com',"email should valid@example.com");
            done();
        });
        it('throws exception after searching for non-existent user',function(done){
            var user = UserService.findUserById(2);
            expect(user).to.eventually.be.rejectedWith(errors.NotFoundError);
            done();
        });
    });

    // TODO hashing error - always verifies
    describe('verifyPassword',function(){
        var testPasswordUser;
        before(function(done){
            testPasswordUser = User.forge({ id: 1, email: 'password@example.com'});
            testPasswordUser.setPassword('password1');
            done();
        });

        it('verifies correct password',function(done){
            var user = UserService.verifyPassword(testPasswordUser,"password1");
            expect(user).to.eventually.be.rejectedWith('data and hash arguments required');
            expect(user).to.eventually.equal(true);
            done();
        });
        it('verifies correct response for incorrect password',function(done){
            var user = UserService.verifyPassword(testPasswordUser,"wrongPassword");
            expect(user).to.eventually.be.rejectedWith(errors.InvalidParameterError);
            done();
        });
    });

    after(function(done) {
        emailStub.restore();
        createStub.restore();
        done();
    });
});