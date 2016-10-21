var assert = require('chai').assert;
var chai = require('chai');
var chaiHttp = require('chai-http');

var api = require('../../../../api');
var testHelper = require('../testHelper');
var Token = require('../../models/Token');
var UserService = require('../../services/UserService');
var User = require('../../models/User');

var consts = require('../testConsts');

chai.use(chaiHttp);
var should = chai.should();


describe("/v1/auth admin functionality", function() {
    var key;
    it('Admins should be able to obtain auth token', function(done) {
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
                key = res.body.data.auth;

                UserService.findUserByEmail(process.env.HACKILLINOIS_SUPERUSER_EMAIL)
                    .then(function(user) {
                        assert.equal(user.attributes.id,
                                     1, "Super user should be first user");
                        done();
                    });
            });
    });

    describe('POST /v1/auth/refresh', function () {
        it('Admin should be able to refresh their token using auth', function (done) {
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
                    'email': process.env.HACKILLINOIS_SUPERUSER_EMAIL
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
                Token.collection().query({where: {user_id: 1}}).fetchOne()
                    .then(function(token) {
                        var resetReq = {
                            'token': token.attributes.value,
                            'password': process.env.HACKILLINOIS_SUPERUSER_PASSWORD
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
