var _Promise = require('bluebird');

var chai = require('chai');
var sinon = require('sinon');
var _ = require('lodash');

var errors = require('../api/v1/errors');
var UserService = require('../api/v1/services/UserService.js');
var User = require('../api/v1/models/User.js');

var assert = chai.assert;
var expect = chai.expect;
var tracker = require('mock-knex').getTracker();

describe('UserService',function() {
	describe('createUser', function() {
		var _createUser;
		var _findByEmail;
		var testUser;

		before(function (done) {
			testUser = { id: 1, email: 'new@example.com', password: 'password123' };

			_createUser = sinon.spy(User, 'create');
			_findByEmail = sinon.spy(User, 'findByEmail');
			done();
		});
		beforeEach(function (done) {
			tracker.install();
			done();
		});
		it('creates a new user', function (done) {
			var testUserClone = _.clone(testUser);

			tracker.on('query', function (query) {
				query.response(['1']);
			});

			var user = UserService.createUser(testUserClone.email, testUserClone.password, null);

			user.bind(this).then(function() {

				assert(_createUser.calledOnce, 'User forge not called with right parameters');
				return done();
			}).catch(function (err) {
				return done(err);
			});

		});
		it('throws an error for an existing user', function (done) {
			var testUserClone = _.clone(testUser);
			tracker.on('query', function (query) {
				var err = new Error();
				err.code = errors.Constants.DupEntry;
				query.reject(err);
			});

			var user = UserService.createUser(testUserClone.email, testUserClone.password, null);
			expect(user).to.eventually.be.rejectedWith(errors.InvalidParameterError).and.notify(done);
		});
		afterEach(function (done) {
			tracker.uninstall();
			done();
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
			_findByEmail.withArgs(sinon.match.any).throws('TypeError');
			done();
		});
		it('finds an existing user', function (done) {
			var user = UserService.findUserByEmail('valid@example.com');
			expect(user).to.eventually.have.deep.property('attributes.id', 1);
			expect(user).to.eventually.have.deep.property('attributes.email', 'valid@example.com').and.notify(done);
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
		var _findById;
		before(function(done){
			var testUser = User.forge({ id: 1, email: 'new@example.com' });
			testUser.setPassword('password123');

			_findById = sinon.stub(User, 'findById');

			_findById.withArgs(1).returns(_Promise.resolve(testUser));
			_findById.withArgs(sinon.match.number).returns(_Promise.resolve(null));

			done();
		});
		it('finds existing user',function(done){
			var user = UserService.findUserById(1);
			expect(user).to.eventually.have.deep.property('attributes.id', 1,'ID should be 1, the searched for ID')
				.then(function(){
					expect(user).to.eventually.have.deep.property('attributes.email',
						'new@example.com','email should be new@example.com').notify(done);
				});
		});
		it('throws exception after searching for non-existent user',function(done){
			var user = UserService.findUserById(2);
			expect(user).to.eventually.be.rejectedWith(errors.NotFoundError).and.notify(done);
		});
		after(function(done){
			_findById.restore();
			done();
		});
	});

	describe('verifyPassword',function(){

		var testUser;

		before(function(done){
			testUser = User.forge({ id: 1, email: 'new@example.com' });
			testUser.setPassword('password123')
				.then(function(updatedUser){
					testUser = updatedUser;
					done();
				});
		});


		it('tries a correct password',function(done){

			var user = UserService.verifyPassword(testUser,'password123');

			expect(user).to.eventually.equal(true).and.notify(done);

		});

		it('tries an incorrect password',function(done){

			var user = UserService.verifyPassword(testUser,'wrongPassword');

			expect(user).to.eventually.be.rejectedWith(errors.InvalidParameterError).and.notify(done);
		});

	});

	describe('resetPassword',function(){
		var testUser;
		var _save;
		before(function(done){
			testUser = User.forge({ id: 1, email: 'new@example.com' });
			testUser.setPassword('password123')
				.then(function(updatedUser){
					testUser = updatedUser;

					_save = sinon.stub(User.prototype,'save');
					_save.withArgs().returns(this);

					done();
				});
		});
		it('resets password',function(done){
			var user = UserService.resetPassword(testUser,'password456').then(function(updatedUser){
				return UserService.verifyPassword(updatedUser,'password456');
			});
			expect(user).to.eventually.equal(true).and.notify(done);
		});
		after(function(done){
			_save.restore();
			done();
		});
	});
});
