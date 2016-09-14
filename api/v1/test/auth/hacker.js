var chai = require('chai');
var chaiHttp = require('chai-http');

var api = require('../../../../api');
var UserService = require('../../services/UserService');
var User = require('../../models/User');
var testHelper = require('../testHelper');

chai.use(chaiHttp);
var should = chai.should();

var consts = require('../testConsts');


/*
  endpoints['/v1/auth/reset'] = {
  POST: requests.ResetPasswordRequest
  };
  endpoints['/v1/auth'] = {
  POST: requests.AuthTokenRequest
  };
*/

describe('/v1/auth hacker functionality', function() {
    var key;

    before(function(done) {
        // We need to create a hacker in order to run our auth tests.
        var req = {
            'email': consts.DUMMY_USER.email,
            'password': consts.DUMMY_USER.password,
            'confirmedPassword': consts.DUMMY_USER.password
        };

        chai.request(api)
            .post('/v1/user')
            .send(req)
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.data.auth.should.not.be.null;
                key = res.body.data.auth;
                done();
            });
    });

    after(function(done) {
        UserService.findUserByEmail(consts.DUMMY_USER.email)
            .then(function(result) {
                result.destroy();
                done();
            });
    });

    describe('POST /auth/reset', function() {
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
                        res.body.error.type.should.equal('MissingParameterError');
                        res.body.error.source.should.equal(["email"]);
                        done();
                    });
            });

            it('We should be able to request a token with a good email address', function(done) {
                var req = {
                    'email': consts.DUMMY_USER
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
})
