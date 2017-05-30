const _Promise = require('bluebird');

const chai = require('chai');
const sinon = require('sinon');
const _ = require('lodash');

const errors = require('../api/v1/errors');
const UserService = require('../api/v1/services/UserService.js');
const User = require('../api/v1/models/User.js');

const assert = chai.assert;
const expect = chai.expect;
const tracker = require('mock-knex').getTracker();

describe('UserService',() => {
	describe('createUser', () => {
		let _createUser;
		let _findByEmail;
		let testUser;

		before((done) => {
			testUser = { id: 1, email: 'new@example.com', password: 'password123' };

			_createUser = sinon.spy(User, 'create');
			_findByEmail = sinon.spy(User, 'findByEmail');
			done();
		});
		beforeEach((done) => {
			tracker.install();
			done();
		});
		it('creates a new user', function (done) {
			const testUserClone = _.clone(testUser);

			tracker.on('query', (query) => {
				query.response(['1']);
			});

			const user = UserService.createUser(testUserClone.email, testUserClone.password, null);

			user.bind(this).then(() => {

				assert(_createUser.calledOnce, 'User forge not called with right parameters');
				return done();
			}).catch((err) => {
				return done(err);
			});

		});
		it('throws an error for an existing user', (done) => {
			const testUserClone = _.clone(testUser);
			tracker.on('query', (query) => {
				const err = new Error();
				err.code = errors.Constants.DupEntry;
				query.reject(err);
			});

			const user = UserService.createUser(testUserClone.email, testUserClone.password, null);
			expect(user).to.eventually.be.rejectedWith(errors.InvalidParameterError).and.notify(done);
		});
		afterEach((done) => {
			tracker.uninstall();
			done();
		});
		after((done) => {
			_createUser.restore();
			_findByEmail.restore();
			done();
		});
	});

	describe('findUserByEmail',() => {
		let _findByEmail;

		before((done) => {
			const testUser = User.forge({ id: 1, email: 'valid@example.com' });

			_findByEmail = sinon.stub(User,'findByEmail');

			_findByEmail.withArgs(testUser.get('email')).returns(_Promise.resolve(testUser));
			_findByEmail.withArgs(sinon.match.string).returns(_Promise.resolve(null));
			_findByEmail.withArgs(sinon.match.any).throws('TypeError');
			done();
		});
		it('finds an existing user', (done) => {
			const user = UserService.findUserByEmail('valid@example.com');
			expect(user).to.eventually.have.deep.property('attributes.id', 1);
			expect(user).to.eventually.have.deep.property('attributes.email', 'valid@example.com').and.notify(done);
		});
		it('throws an error for non-existent user', (done) => {
			const user = UserService.findUserByEmail('invalid@example.com');
			expect(user).to.eventually.be.rejectedWith(errors.NotFoundError).and.notify(done);
		});
		after((done) => {
			_findByEmail.restore();
			done();
		});
	});

	describe('findUserById',() => {
		let _findById;
		before((done) => {
			const testUser = User.forge({ id: 1, email: 'new@example.com' });
			testUser.setPassword('password123');

			_findById = sinon.stub(User, 'findById');

			_findById.withArgs(1).returns(_Promise.resolve(testUser));
			_findById.withArgs(sinon.match.number).returns(_Promise.resolve(null));

			done();
		});
		it('finds existing user',(done) => {
			const user = UserService.findUserById(1);
			expect(user).to.eventually.have.deep.property('attributes.id', 1,'ID should be 1, the searched for ID')
				.then(() => {
					expect(user).to.eventually.have.deep.property('attributes.email',
						'new@example.com','email should be new@example.com').notify(done);
				});
		});
		it('throws exception after searching for non-existent user',(done) => {
			const user = UserService.findUserById(2);
			expect(user).to.eventually.be.rejectedWith(errors.NotFoundError).and.notify(done);
		});
		after((done) => {
			_findById.restore();
			done();
		});
	});

	describe('verifyPassword',() => {

		let testUser;

		before((done) => {
			testUser = User.forge({ id: 1, email: 'new@example.com' });
			testUser.setPassword('password123')
				.then((updatedUser) => {
					testUser = updatedUser;
					done();
				});
		});


		it('tries a correct password',(done) => {

			const user = UserService.verifyPassword(testUser,'password123');

			expect(user).to.eventually.equal(true).and.notify(done);

		});

		it('tries an incorrect password',(done) => {

			const user = UserService.verifyPassword(testUser,'wrongPassword');

			expect(user).to.eventually.be.rejectedWith(errors.InvalidParameterError).and.notify(done);
		});

	});

	describe('resetPassword',() => {
		let testUser;
		let _save;
		before((done) => {
			testUser = User.forge({ id: 1, email: 'new@example.com' });
			testUser.setPassword('password123')
				.then(function(updatedUser){
					testUser = updatedUser;

					_save = sinon.stub(User.prototype,'save');
					_save.withArgs().returns(this);

					done();
				});
		});
		it('resets password',(done) => {
			const user = UserService.resetPassword(testUser,'password456').then((updatedUser) => {
				return UserService.verifyPassword(updatedUser,'password456');
			});
			expect(user).to.eventually.equal(true).and.notify(done);
		});
		after((done) => {
			_save.restore();
			done();
		});
	});
});
