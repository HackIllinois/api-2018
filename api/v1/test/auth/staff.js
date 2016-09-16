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

describe('/v1/auth staff functionality', function() {
        var super_user_key;
        var user_id;

        before(function(done) {
                // We need to create a staff member in order to run our auth tests.
                var req = {
                        'email': process.env.HACKILLINOIS_SUPERUSER_EMAIL,
                        'password': process.env.HACKILLINOIS_SUPERUSER_PASSWORD
                };

                chai.request(api)
                        .post('/v1/auth')
                        .send(req)
                        .end(function(err, res) {
                                res.should.have.status(200);
                                res.body.data.auth.should.not.be.null;
                                super_user_key = res.body.data.auth;
                                var req = {
                                        'email': USER1.email,
                                        'role': 'STAFF'
                                };

                                chai.request(api)
                                        .post('/v1/user/accredited')
                                        .set('Authorization', super_user_key)
					.send(req)
                                        .end(function (err, res) {
                                                testHelper.userAssertHelper(res);
                                                res.body.data.role.should.equal('STAFF');
						UserService.findUserByEmail(USER1.email)
							.then(function (userModel) {
								user_id = userModel.attributes.id;
								done();
							});
                                        });
                        });
        });

        after(function(done) {
                testHelper.userDelete(USER1.email);
                done();
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
                                Token.collection().query({ where: { 'user_id': user_id }}).fetchOne()
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
