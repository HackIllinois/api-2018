const chai = require('chai');

const errors = require('../api/v1/errors');
const utils = require('../api/v1/utils');
const User = require('../api/v1/models/User.js');
const AuthService = require('../api/v1/services').AuthService;

const jwt = require('jsonwebtoken');

const expect = chai.expect;

describe('AuthService', () => {

  describe('issueForUser', () => {
    let testUser;

    before((done) => {
      testUser = User.forge({
        id: 1,
        email: 'new@example.com'
      });
      testUser.related('roles')
        .add({
          role: utils.roles.ATTENDEE
        });

      done();
    });
    it('issues a token for a valid user', (done) => {
      const token = AuthService.issueForUser(testUser);
      token.then((data) => {
        const decoded = jwt.decode(data, {
          complete: true
        });

        expect(decoded.payload.email)
          .to.equal('new@example.com');
        expect(decoded.payload.roles[0].role)
          .to.equal('ATTENDEE');
        expect(decoded.payload.sub)
          .to.equal('1');

        done();
      });
    });
    it('refuses a token for a blank user', (done) => {
      try {
        AuthService.issueForUser(new User());
      } catch (e) {
        expect(e)
          .to.be.instanceof(TypeError);
        done();
      }
    });
  });

  describe('verify', () => {
    let testUser;
    before((done) => {
      testUser = User.forge({
        id: 1,
        email: 'new@example.com'
      });
      testUser.related('roles')
        .add({
          role: utils.roles.ATTENDEE
        });
      done();
    });
    it('verifies a valid auth token', (done) => {
      AuthService.issueForUser(testUser)
        .then((token) => {
          const verification = AuthService.verify(token);
          expect(verification)
            .to.eventually.have.deep.property('email', 'new@example.com')
            .then(() => {
              expect(verification)
                .to.eventually.have.deep.property('sub', '1')
                .and.notify(done);
            });
        });
    });
    it('refuses a fake auth token', (done) => {
      const token = 'FAKE TOKEN';
      const verification = AuthService.verify(token);
      expect(verification)
        .to.eventually.be.rejectedWith(errors.UnprocessableRequestError)
        .and.notify(done);
    });
  });

});
