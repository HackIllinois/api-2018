var assert = require('chai').assert;
var chai = require('chai');
var chaiHttp = require('chai-http');

var api = require('../../../../api');
var testHelper = require('../testHelper');
var Token = require('../../models/Token');
var UserService = require('../../services/UserService');
var User = require('../../models/User');

chai.use(chaiHttp);
var should = chai.should();

const UNIQUE_PREFIX = 'v1-auth-staff-';
const USER1 = testHelper.userGenerate(UNIQUE_PREFIX);

describe('/v1/auth hacker functionality', function() {
        var key;
        var uid;

        before(function(done) {
                // We need to create a hacker in order to run our auth tests.
                var req = {
                        'email': USER1.email,
                        'password': USER1.password,
                        'confirmedPassword': USER1.password
                };

                chai.request(api)
                        .post('/v1/user')
                        .send(req)
                        .end(function(err, res) {
                                res.should.have.status(200);
                                res.body.data.auth.should.not.be.null;
                                key = res.body.data.auth;
                                UserService.findUserByEmail(USER1.email)
                                        .then(function(model) {
                                                uid = model.attributes.id;
                                                done();
                                        });
                        });
        });

        after(function(done) {
                testHelper.userDelete(USER1.email)
                        .then(function () {
                                done();
                        });
        });

        describe('POST /v1/auth', function () {
                it('Users should be able to obtain auth token', function(done) {
                        var req = {
                                'email': USER1.email,
                                'password': USER1.password
                        };

                        chai.request(api)
                                .post('/v1/auth')
                                .send(req)
                                .end(function (err, res) {
                                        res.should.have.status(200);
                                        res.body.data.auth.should.not.be.null;
					key = res.body.data.auth;
					done();
                                });
                });
        });

	describe('POST /v1/auth/refresh', function () {
		it('Users should be able to refresh their token using auth', function (done) {
			chai.request(api)
				.post('/v1/auth/refresh')
				.set('Authorization', key)
				.end(function(err, res) {
					res.should.have.status(200);
					assert.notEqual(key, res.body.data.auth);
					key = res.body.data.auth;
					done();
				});
		});
	});

        describe('POST /v1/auth/reset', function() {
                if (process.env.NODE_ENV != 'development')
                {
                        console.log('Cannot run the password reset test outside of development enviornment.');
                }
                else
                {
                        before(function (done) {
                                var req = {
                                        'email': USER1.email
                                };

                                chai.request(api)
                                        .post('/v1/user/reset')
                                        .send(req)
                                        .end(function(err, res) {
                                                res.should.have.status(200);
                                                done();
                                        });
                        });

                        it('Should NOT be able to reset our password with a bad token', function(done) {
                                var req = {
                                        'token': '0xDEADBEEF',
                                        'password': 'deadbeefpassword'
                                };
                                chai.request(api)
                                        .post('/v1/auth/reset')
                                        .end(function(err, res) {
                                                res.should.not.have.status(200);
                                                done();
                                        });
                        });

                        it('Should be able to reset our password with a good token', function(done) {
                                Token.collection().query({where: {user_id: uid}}).fetchOne()
                                        .then(function(token) {
                                                var resetReq = {
                                                        'token': token.attributes.value,
                                                        'password': 'ANewPassword'
                                                };

                                                chai.request(api)
                                                        .post('/v1/auth/reset')
                                                        .send(resetReq)
                                                        .end(function(err, res) {
                                                                res.should.have.status(200);
                                                                done();
                                                        });
                                        });
                        });
                }
        });
});
