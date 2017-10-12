const _Promise = require('bluebird');

const chai = require('chai');
const sinon = require('sinon');

const errors = require('../api/v1/errors');
const utils = require('../api/v1/utils');
const TokenService = require('../api/v1/services').TokenService;
const Token = require('../api/v1/models/Token.js');
const User = require('../api/v1/models/User.js');

const expect = chai.expect;

describe('TokenService', () => {
  let tokenVal;
  let testToken;

  describe('findTokenByValue', () => {
    let _findByValue;

    before((done) => {
      tokenVal = utils.crypto.generateResetToken();
      testToken = Token.forge({type: 'DEFAULT', value: tokenVal, user_id: 1});

      _findByValue = sinon.stub(Token, 'findByValue');
      _findByValue.withArgs(tokenVal).returns(_Promise.resolve(testToken));
      _findByValue.withArgs(sinon.match.string).returns(_Promise.resolve(null));

      done();
    });

    it('finds valid token', (done) => {
      const found = TokenService.findTokenByValue(tokenVal, 'DEFAULT');
      expect(found).to.eventually.have.deep.property('attributes.user_id', 1, 'user ID should be 1')
				.then(() => {
  expect(found).to.eventually.have.deep.property('attributes.value', tokenVal, 'token value sould be '+tokenVal)
						.and.notify(done);
});
    });
    it('throws error for invalid scope', (done) => {
      TokenService.findTokenByValue(tokenVal, 'INVALID')
				.then(() => done('Error was not thrown for INVALID token scope'))
				.catch((err) => {
  expect(err).to.be.instanceof(TypeError);
  return done();
});
    });
    it('throws error with expired token and calls delete on token', (done) => {
      const _get = sinon.stub(Token.prototype, 'get');
      _get.withArgs('created').returns(0);
      const _destroy = sinon.stub(Token.prototype, 'destroy');
      const found = TokenService.findTokenByValue(tokenVal, 'DEFAULT');
      expect(found).to.eventually.be.rejectedWith(errors.TokenExpirationError)
				.then(() => {
  expect(_destroy.neverCalledWith()).to.equal(false);
  _get.restore();
  _destroy.restore();
  done();
});
    });
    it('throws error if invalid token', (done) => {
      const found = TokenService.findTokenByValue('invalid', 'DEFAULT');
      expect(found).to.eventually.be.rejectedWith(errors.NotFoundError).and.notify(done);
    });

    after((done) => {
      _findByValue.restore();
      done();
    });
  });

  describe('generateToken', () => {

    let testUser;

    let _mockedTokens, _mockedWhere;
    let _where, _save;

    before((done) => {

      _mockedTokens = {
        invokeThen: function(){
          return _Promise.resolve(null);
        }
      };
      _mockedWhere = {
        fetchAll: function(){
          return _Promise.resolve(_mockedTokens);
        }
      };

      testUser = User.forge({ id: 1, email: 'new@example.com' });

      testToken = Token.forge({type: 'DEFAULT', value: tokenVal, user_id: 1});



      _where = sinon.stub(Token, 'where');

      _where.returns(_mockedWhere);

      _save = sinon.stub(Token.prototype, 'save');

      _save.returns(_Promise.resolve(null));


      done();

    });

    it('generates a new token', (done) => {

      const token = TokenService.generateToken(testUser, '7d');

      expect(token).to.eventually.be.a('string')
				.then((data) => {
  expect(data.length).to.equal(36);
  done();
});
    });

  });
});
