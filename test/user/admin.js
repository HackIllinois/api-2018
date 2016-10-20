var chai = require('chai');
var chaiHttp = require('chai-http');

var api = require('../../../../api');
var UserService = require('../../services/UserService');
var User = require('../../models/User');
var testHelper = require('../testHelper');

chai.use(chaiHttp);
var should = chai.should();

const UNIQUE_PREFIX = 'v1-user-admin';
const USER1 = testHelper.userGenerate(UNIQUE_PREFIX);
const USER2 = testHelper.userGenerate(UNIQUE_PREFIX);

describe('/v1/user admin functionality', function() {
        var super_user_key;
        var super_user_id;

        before(function(done) {
                // grab a brand new authentication token for a staffed user
                var req = {
                        "email": process.env.HACKILLINOIS_SUPERUSER_EMAIL,
                        "password": process.env.HACKILLINOIS_SUPERUSER_PASSWORD
                };

                chai.request(api)
                        .post('/v1/auth/')
                        .send(req)
                        .end(function(err, res) {
                                res.should.have.status(200);
                                res.body.data.auth.should.not.be.null;
                                super_user_key = res.body.data.auth;
                                UserService.findUserByEmail(process.env.HACKILLINOIS_SUPERUSER_EMAIL)
                                        .then(function(user) {
                                                super_user_id = user.attributes.id;
                                                done();
                                        });
                        });

        });

        /* Admin user creation tests */
        describe('POST /v1/user/accredited', function() {
                it('Admin should be able to create staffed users', function(done) {
                        var req = {
                                "email": USER1.email,
                                "role": "STAFF"
                        };

                        chai.request(api)
                                .post('/v1/user/accredited')
                                .send(req)
                                .set('Authorization', super_user_key)
                                .end(function(err, res) {
                                        testHelper.userAssertHelper(res);
                                        res.body.data.role.should.equal('STAFF');
                                        done();
                                });
                });

                it('Admin should be able to create Hacker users', function(done) {
                        var req = {
                                "email": USER1.email,
                                "role": "HACKER"
                        };

                        chai.request(api)
                                .post('/v1/user/accredited')
                                .send(req)
                                .set('Authorization', super_user_key)
                                .end(function(err, res) {
                                        testHelper.userAssertHelper(res);
                                        res.body.data.role.should.equal("HACKER");
                                        done();
                                });
                });

                afterEach(function(done) {
                        testHelper.userDelete(USER1.email)
                                .then(function () {
                                        done();
                                });
                });
        });

        /* Admin accessiblity tests */
        describe('GET /user/:id/', function() {
                var hacker_id;
                var staff_id;

                before(function(done) {
                        var req = {
                                "email": USER1.email,
                                "role": 'STAFF'
                        };

                        chai.request(api)
                                .post('/v1/user/accredited')
                                .set('Authorization', super_user_key)
                                .send(req)
                                .end(function(err, res) {
                                        testHelper.userAssertHelper(res);
                                        staff_id = res.body.data.id;

                                        var req = {
                                                "email": USER2.email,
                                                "role": "HACKER"
                                        };

                                        chai.request(api)
                                                .post('/v1/user/accredited')
                                                .send(req)
                                                .set('Authorization', super_user_key)
                                                .end(function(err, res) {
                                                        testHelper.userAssertHelper(res);
                                                        hacker_id = res.body.data.id;
                                                        done();
                                                });
                                });
                });

                it('Admin should be able to access own user id', function(done) {
                        chai.request(api)
                                .get('/v1/user/' + super_user_id)
                                .set('Authorization', super_user_key)
                                .end(function(err, res) {
                                        testHelper.userAssertHelper(res);
                                        done();
                                });
                });

                it('Admin should be able to access staff member ids', function(done) {
                        chai.request(api)
                                .get('/v1/user/' + staff_id)
                                .set('Authorization', super_user_key)
                                .end(function(err, res) {
                                        testHelper.userAssertHelper(res);
                                        done();
                                });
                });

                it('Admin should be able to access hacker ids', function(done) {
                        chai.request(api)
                                .get('/v1/user/' + hacker_id)
                                .set('Authorization', super_user_key)
                                .end(function(err, res) {
                                        testHelper.userAssertHelper(res);
                                        done();
                                });
                });

                after(function(done) {
                        testHelper.userDelete(USER1.email);
                        testHelper.userDelete(USER2.email);
                        done();
                });
        });
});
