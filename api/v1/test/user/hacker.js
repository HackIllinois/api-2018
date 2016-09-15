var chai = require('chai');
var chaiHttp = require('chai-http');

var api = require('../../../../api');
var UserService = require('../../services/UserService');
var User = require('../../models/User');
var testHelper = require('../testHelper');
var consts = require('../testConsts');

chai.use(chaiHttp);
var should = chai.should();

describe('/v1/user hacker functionality', function() {
        var key;

        before(function(done) {
                // create a hacker and grab an authentication token to use
                var req = {
                        'email': consts.DUMMY_USER.email,
                        'password': consts.DUMMY_USER.password,
                        'confirmedPassword': consts.DUMMY_USER.password
                };

                chai.request(api)
                        .post('/v1/user/')
                        .send(req)
                        .end(function(err, res) {
                                res.should.have.status(200);
                                res.body.data.auth.should.not.be.null;
                                key = res.body.data.auth;
                                done();
                        });
        });

        after(function(done) {
                testHelper.userDelete(consts.DUMMY_USER.email)
			.then(function () {
				done();
			});
        });

        describe('POST /user/accredited', function() {
                it('should not be able to create staff/admin users', function(done) {
                        var req = {
                                "email": consts.UNIQUE_DUMMY_USER.email,
                                "role": "STAFF"
                        };

                        chai.request(api)
                                .post('/v1/user/accredited')
                                .set('Authorization', key)
                                .send(req)
                                .end(function(err, res) {
                                        res.should.not.have.status(200);
                                        res.body.error.type.should.equal('UnauthorizedError');
                                        done();
                                });
                });
        });

        describe('GET /user/:id', function() {
                var other_id;
                before(function (done) {
                        var req = {
                                'email': consts.DUMMY_USER_TWO.email,
                                'password': consts.DUMMY_USER_TWO.password,
                                'confirmedPassword': consts.DUMMY_USER_TWO.password
                        };

                        chai.request(api)
                                .post('/v1/user')
                                .send(req)
                                .end(function(err, res) {
                                        res.should.have.status(200);
                                        UserService.findUserByEmail(consts.DUMMY_USER_TWO.email)
                                                .then(function(model) {
                                                        other_id = model.attributes.id;
                                                        done();
                                                });
                                });
                });

                after(function (done) {
                        testHelper.userDelete(consts.DUMMY_USER_TWO.email)
                                .then(function () {
                                        done();
                                });
                });

                it('Should be able to access own user id', function(done) {
                        UserService.findUserByEmail(consts.DUMMY_USER.email)
                                .then(function(user) {
                                        chai.request(api)
                                                .get('/v1/user/' + user.attributes.id)
                                                .set('Authorization', key)
                                                .end(function(err, res) {
                                                        testHelper.userAssertHelper(res);
                                                        done();
                                                });
                                });
                });

                it('Should NOT be able to access ADMIN\'s id', function(done) {
                        chai.request(api)
                                .get('/v1/user/1/')
                                .set('Authorization', key)
                                .end(function(err, res) {
                                        res.should.not.have.status(200);
                                        res.body.error.type.should.equal('UnauthorizedError');
                                        done();
                                });
                });

                it('Should NOT be able to access other Hacker\'s id', function(done) {
                        chai.request(api)
                                .get('/v1/user/' + other_id)
                                .set('Authorization', key)
                                .end(function(err, res) {
                                        res.should.not.have.status(200);
                                        res.body.error.type.should.equal('UnauthorizedError');
                                        done();
                                });
                });
        });

        describe('POST v1/user/reset', function() {
                if (process.env.NODE_ENV != 'development')
                {
                        console.log('Cannot run the password reset test outside of development enviornment.');
                }
                else
                {
                        it('We should NOT be able to request a token with a bad email address', function(done) {
                                var req = {
                                        'email': consts.BAD_DUMMY_USER.email
                                };

                                chai.request(api)
                                        .post('/v1/user/reset')
                                        .send(req)
                                        .end(function(err, res) {
                                                res.should.not.have.status(200);
                                                res.body.error.type.should.equal('NotFoundError');
                                                done();
                                        });
                        });

                        it('We should be able to request a token with a good email address', function(done) {
                                var req = {
                                        'email': consts.DUMMY_USER.email
                                };

                                chai.request(api)
                                        .post('/v1/user/reset')
                                        .send(req)
                                        .end(function(err, res) {
                                                res.should.have.status(200);
                                                done();
                                        });
                        });
                }
        });
});
