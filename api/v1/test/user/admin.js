var chai = require('chai');
var chaiHttp = require('chai-http');

var api = require('../../../../api');
var UserService = require('../../services/UserService');
var User = require('../../models/User');
var testHelper = require('../testHelper');

chai.use(chaiHttp);
var should = chai.should();


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
                UserService.findByEmail(process.env.HACKILLINOIS_SUPERUSER_EMAIL)
                    .then(function(user) {
                        super_user_id = user.attributes.id;
                        done();
                    });
            });

    });

    after(function(done) {
        UserService.findUserByEmail("test@example.com")
            .then(function(result) {
		result.destroy();
		UserService.findUserByEmail("test2@example.com")
		    .then(function(result) {
			result.destroy();
			// Only finish after destroying both users for sure.
			done();
		    });
            });
    });

    /* Admin user creation tests */
    describe('POST /user/accredited/', function() {
        it('Admin should be able to create staffed users', function(done) {
            var req = {
                "email": "test@example.com",
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
    });

    describe('POST /user/', function() {
        it('Admin should be able to create hacker users', function(done) {
            var req = {
                "email": "test2@example.com",
                "role": "HACKER"
            };

            chai.request(api)
                .post('/v1/user/')
                .send(req)
                .set('Authorization', super_user_key)
                .end(function(err, res) {
                    testHelper.userAssertHelper(res);
                    res.body.data.role.should.equal('HACKER');
                    done();
                });
        });
    });

    /* Admin accessiblity tests */
    describe('GET /user/:id/', function() {
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
            UserService.findUserByEmail("test@example.com")
                .then(function(user) {
                    chai.request(api)
                        .get('/v1/user/' + user.attributes.id)
                        .set('Authorization', super_user_key)
                        .end(function(err, res) {
                            testHelper.userAssertHelper(res);
                            done();
                        });
                });
        });

        it('Admin should be able to access hacker ids', function(done) {
            UserService.findUserByEmail("test2@example.com")
                .then(function(user) {
                    chai.request(api)
                        .get('/v1/user/' + user.attributes.id)
                        .set('Authorization', super_user_key)
                        .end(function(err, res) {
                            testHelper.userAssertHelper(res);
                            done();
                        });
                });
        });
    });
});
