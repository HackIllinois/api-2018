var chai = require('chai');
var chaiHttp = require('chai-http');

var api = require('../../../../api');
var UserService = require('../../services/UserService');
var User = require('../../models/User');

chai.use(chaiHttp);

describe('general functionality', function() {
  before(function(done) {
    // create a hacker and grab an authentication token to use
    var req = {
      'email': 'test@example.com',
      'password': 'password123',
      'confirmedPassword': 'password123'
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
    // delete our testing hacker
    UserService.findUserByEmail("test@example.com")
               .then(function(result) {
                 new User({id: result.attributes.id})
                   .destroy()
                   .then(function(model) {
                     done();
                   });
               });
  });

  describe('POST /v1/user/reset', function() {
    it('should get a new password reset token with a valid email', function(done) {
      var req = {
        'email': 'test@example.com'
      };

      chai.request(api)
          .post('/v1/user/reset/')
          .send(req)
          .end(function(err, res) {
            console.log(res);
            done();
          });
    });
  });
});
