var chai = require('chai');
var assert = chai.assert;
var chaiHttp = require('chai-http');

var api = require('../../../../api');
var testHelper = require('../testHelper');
var Token = require('../../models/Token');
var UserService = require('../../services/UserService');
var User = require('../../models/User');

chai.use(chaiHttp);
var should = chai.should();

const UNIQUE_PREFIX = 'v1-user-staff-';
const USER1 = testHelper.userGenerate(UNIQUE_PREFIX);
const USER2 = testHelper.userGenerate(UNIQUE_PREFIX);
const USER3 = testHelper.userGenerate(UNIQUE_PREFIX);
// TODO -- fix functionality
describe('/v1/user staff functionality', function() {
        var super_user_key;
        var staff_user_key;
        var id;

        function _requestReset(done)
        {

                var pwd_reset_req = {
                        "email": USER1.email
                };

                chai.request(api)
                        .post('/v1/user/reset')
                        .send(pwd_reset_req)
                        .end(function(err, res) {
                                res.should.have.status(200);
                                Token.collection()
                                        .query({ where: {user_id: id}})
                                        .fetchOne()
                                        .then(function(tokenModel) {
                                                var pwd_reset = {
                                                        'email': USER1.email,
                                                        'password': USER1.password,
                                                        'token': tokenModel.attributes.value
                                                };

                                                chai.request(api)
                                                        .post('/v1/auth/reset')
                                                        .send(pwd_reset)
                                                        .end(function(err, res) {
                                                                res.should.have.status(200);
                                                                res.body.data.auth.should.not.be.null;
                                                                staff_user_key = res.body.data.auth;
                                                                done();
                                                        });
                                        });
                        });
        }

        before(function(done) {
                // grab a brand new authentication token for a staffed user
                var req = {
                        "email": process.env.HACKILLINOIS_SUPERUSER_EMAIL,
                        "password": process.env.HACKILLINOIS_SUPERUSER_PASSWORD
                };

                var staff_req = {
                        "email": USER1.email,
                        "role": "STAFF"
                };

                // Create a dummy staff user to use for testing
                chai.request(api)
                        .post('/v1/auth')
                        .send(req)
                        .end(function(err, res) {
                                res.should.have.status(200);
                                res.body.data.auth.should.not.be.null;
                                super_user_key = res.body.data.auth;
                                chai.request(api)
                                        .post('/v1/user/accredited')
                                        .send(staff_req)
                                        .set('Authorization', super_user_key)
                                        .end(function(err, res) {
                                                res.should.have.status(200);
                                                id = res.body.data.id;
                                                /* We need to reset this user's
                                                   password to obtain the auth token */
                                                _requestReset(done);
                                        });
                        });
        });

        after(function(done) {
                testHelper.userDelete(USER1.email);
                done();
        });

        describe('POST /v1/user/accredited', function() {
                it('Staff should be able to create Hackers', function(done) {
                        var req = {
                                "email": USER2.email,
                                "role": "HACKER"
                        };

                        chai.request(api)
                                .post('/v1/user/accredited')
                                .send(req)
                                .set('Authorization', staff_user_key)
                                .end(function(err, res) {
                                        testHelper.userAssertHelper(res);
                                        res.body.data.role.should.equal('HACKER');
                                        done();
                                });
                });

                it('Staff should NOT be able to create other staff', function(done) {
                        var req = {
                                "email": USER2.email,
                                "role": "STAFF"
                        };

                        chai.request(api)
                                .post('/v1/user/accredited')
                                .send(req)
                                .set('Authorization', staff_user_key)
                                .end(function(err, res) {
                                        res.should.not.have.status(200);
                                        res.body.error.type.should.equal('UnauthorizedError');
                                        done();
                                });
                });

                afterEach(function(done) {
                        testHelper.userDelete(USER2.email);
                        done();
                });
        });

        describe('GET /v1/user/:id/', function() {
                var other_id;
                before(function (done) {
                        var req = {
                                'email': USER3.email,
                                'password': USER3.password,
                                'confirmedPassword': USER3.password
                        };

                        chai.request(api)
                                .post('/v1/user')
                                .send(req)
                                .end(function(err, res) {
					res.should.have.status(200);
                                        res.body.data.auth.should.not.be.null;
                                        UserService.findUserByEmail(USER3.email)
                                                .then(function (userModel) {
                                                        other_id = userModel.attributes.id;
                                                        done();
                                                });
                                });
                });

                after(function (done) {
                        testHelper.userDelete(USER3.email);
                        done();
                });

                it('Staff should be able to access own user id', function(done) {
                        chai.request(api)
                                .get('/v1/user/' + id)
                                .set('Authorization', staff_user_key)
                                .end(function(err, res) {
                                        testHelper.userAssertHelper(res);
					done();
                                });
                });

                it('Staff should be able to access other user ids', function(done) {
                        chai.request(api)
                                .get('/v1/user/' + other_id)
                                .set('Authorization', staff_user_key)
                                .end(function(err, res) {
                                        testHelper.userAssertHelper(res);
                                        done();
                                });
                });

		// TODO: Find out why there is no response at all
                // it('Staff should NOT be able to access Admin', function (done) {
                //         chai.request(api)
                //                 .get('v1/user/1')
                //                 .set('Authorization', staff_user_key)
                //                 .end(function(err, res) {
		// 			console.log(res);
		// 			res.should.not.have.status(200);
                //                         res.body.error.type.should.equal('UnauthorizedError');
                //                         done();
                //                 });
                // });
        });
});
