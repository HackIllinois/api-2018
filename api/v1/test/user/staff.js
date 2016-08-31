var chai = require('chai');
var chaiHttp = require('chai-http');

var api = require('../../../../api');
var UserService = require('../../services/UserService');
var User = require('../../models/User');
var testHelper = require('../testHelper');

chai.use(chaiHttp);
var should = chai.should();

describe('staffed user functionality', function() {
  var key;

  before(function(done) {
    // grab a brand new authentication token for a staffed user
    var req = {
      "email": "admin@example.com",
      "password": "ABCD1234!"
    };

    chai.request(api)
        .post('/v1/auth/')
        .send(req)
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.data.auth.should.not.be.null;
          key = res.body.data.auth;
          done();
        });
  });

  after(function(done) {
    UserService.findUserByEmail("test@example.com")
               .then(function(result) {
                 new User({id: result.attributes.id})
                   .destroy()
                   .then(function(model) {
                     done();
                   });
               })
  });

  describe('POST /user/accredited/', function() {
    it('should be able to create staffed users', function(done) {
      var req = {
        "email": "test@example.com",
        "role": "STAFF"
      };

      chai.request(api)
          .post('/v1/user/accredited')
          .send(req)
          .set('Authorization', key)
          .end(function(err, res) {
            testHelper.userAssertHelper(res)
            res.body.data.role.should.equal('STAFF');
            done();
          });
    });
  });

  describe('GET /user/:id/', function() {
    it('should be able to access own user id', function(done) {
      chai.request(api)
          .get('/v1/user/1/')
          .set('Authorization', key)
          .end(function(err, res) {
            testHelper.userAssertHelper(res);
            done();
          });
    });

    it('should be able to access other user ids', function(done) {
      UserService.findUserByEmail("test@example.com")
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
  });
});
