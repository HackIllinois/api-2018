var _Promise = require('bluebird');

var chai = require('chai');
var sinon = require('sinon');

var errors = require('../api/v1/errors');
var utils = require('../api/v1/utils');
var UserService = require('../api/v1/services/UserService.js');
var User = require('../api/v1/models/User.js');

var assert = chai.assert;
var expect = chai.expect;

// TODO move these to separate file
describe('UserService',function(){
	describe('createUser', function () {
		var _createUser;
		var _findByEmail;

		before(function (done) {
			var testUser = User.forge({ id: 1, email: 'new@example.com' });
			testUser.setPassword('password123').then(function () {
				testUser.related('roles').add({ role: utils.roles.ATTENDEE });

				_createUser = sinon.stub(User, 'create');
				_findByEmail = sinon.stub(User, 'findByEmail');
				_findById = sinon.stub(User, 'findById');

				_createUser.withArgs(sinon.match.string, sinon.match.string, sinon.match.string).returns(_Promise.resolve(testUser));
				_findByEmail.withArgs('existing@example.com').returns(_Promise.resolve(testUser));
				_findByEmail.withArgs(sinon.match.string).returns(_Promise.resolve(null));
				_findById.withArgs(1).returns(_Promise.resolve(testUser));
				_findById.withArgs(sinon.match.number).returns(_Promise.resolve(null));

				done();
			});
		});
		it('creates a new user', function (done) {
			var user = UserService.createUser('new@example.com', 'password123', utils.roles.ATTENDEE);
			expect(user).to.eventually.have.deep.property("attributes.id", 1);
			expect(user).to.eventually.have.deep.property("attributes.email", 'new@example.com');

			// TODO think about restructuring this...
			user.tap(function (u) {
				return expect(u.hasRole(utils.roles.ATTENDEE)).to.equal(true);
			}).tap(function (u) {
				return expect(u.hasPassword('password123')).to.eventually.equal(true);
			}).then(function () { done(); }).catch(done);
		});
		it('throws an error for an existing user', function (done) {
			var user = UserService.createUser('existing@example.com', 'password123', utils.roles.ATTENDEE);
			expect(user).to.eventually.be.rejectedWith(errors.InvalidParameterError).and.notify(done);
		});
		after(function(done) {
			_createUser.restore();
			_findByEmail.restore();
			done();
		});
	});
	describe('findUserByEmail',function() {
		var _findByEmail;

		before(function (done) {
			var testUser = User.forge({ id: 1, email: 'valid@example.com' });

			_findByEmail = sinon.stub(User,'findByEmail');

			_findByEmail.withArgs(testUser.get('email')).returns(_Promise.resolve(testUser));
			_findByEmail.withArgs(sinon.match.string).returns(_Promise.resolve(null));
			_findByEmail.withArgs(sinon.match.any).throws("TypeError");
			done();
		});
		it('finds an existing user', function (done) {
			var user = UserService.findUserByEmail('valid@example.com');
			expect(user).to.eventually.have.deep.property("attributes.id", 1);
			expect(user).to.eventually.have.deep.property("attributes.email", 'valid@example.com').and.notify(done);
		});
		it('throws an error for non-existent user', function (done) {
			var user = UserService.findUserByEmail('invalid@example.com');
			expect(user).to.eventually.be.rejectedWith(errors.NotFoundError).and.notify(done);
		});
		after(function(done) {
			_findByEmail.restore();
			done();
		});
	});

	describe('findUserById',function(){
		it('finds existing user',function(done){
			var user = UserService.findUserById(1);
			expect(user).to.eventually.have.deep.property("attributes.id", 1,"ID should 1, the searched for ID");
			expect(user).to.eventually.have.deep.property("attributes.email",
				'new@example.com',"email should new@example.com");
			done();
		});
		it('throws exception after searching for non-existent user',function(done){
			var user = UserService.findUserById(2);
			expect(user).to.eventually.be.rejectedWith(errors.NotFoundError);
			done();
		});
	});
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
});
