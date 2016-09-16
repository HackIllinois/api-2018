var assert = require('chai').assert;
var chai = require('chai');
var chaiHttp = require('chai-http');

var api = require('../../../../api');
var UserService = require('../../services/UserService');
var User = require('../../models/User');
var testHelper = require('../testHelper');

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
                                                assert.equal(user.attributes.id, 1, "Super user should be first user");
                                                done();
                                        });
                        });
        });
});
