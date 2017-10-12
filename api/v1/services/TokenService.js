/* jshint esversion: 6 */

const _Promise = require('bluebird');
const Token = require('../models/Token');
const errors = require('../errors');
const utils = require('../utils');

const TOKEN_NOT_FOUND_ERROR = 'The supplied token does not exist';
const TOKEN_SCOPE_INVALID_ERROR = 'An invalid or non-existent scope was supplied';

function TokenService(ctx) {
  let config = ctx.config();

  /**
   * Finds a token given the Token value
   * @param {String} value The Token's value
   * @param {String} scope The Scope the token is for
   * @return {Promise} resolving to the associated Token Model
   * @throws {NotFoundError} when the requested token cannot be found
   * @throws {TokenExpirationError} when the request token has expired
   * @throws {TypeError} when the scope was not found
   */
  this.findTokenByValue = (value, scope) => {
    if (!(scope in config.token.expiration)) {
      return _Promise.reject(new TypeError(TOKEN_SCOPE_INVALID_ERROR));
    }

    return Token
      .findByValue(value)
      .then((result) => {
        if (!result) {
          throw new errors.NotFoundError(TOKEN_NOT_FOUND_ERROR);
        }

        const expiration = utils.time.toMilliseconds(config.token.expiration[scope]);
        const tokenExpiration = Date.parse(result.get('created')) + expiration;
        if (tokenExpiration < Date.now()) {
          result.destroy();
          throw new errors.TokenExpirationError();
        }

        return _Promise.resolve(result);
      });
  };

  /**
   * Generates a token and deletes all existing tokens
   * with the same scope.
   * @param {User} user The user object to create a reset token for.
   * @param {String} scope The scope to create the token for.
   * @return {Promise<Bool>} Returns a Promise that resolves to
   *                         true on a successful token creation.
   */
  this.generateToken = (user, scope) => {
    const tokenVal = utils.crypto.generateResetToken();
    const userId = user.get('id');

    return Token
      .where({
        user_id: userId,
        type: scope
      })
      .fetchAll()
      .then((tokens) => tokens.invokeThen('destroy')
        .then(() => {
          const token = Token.forge({
            type: scope,
            value: tokenVal,
            user_id: userId
          });
          return token.save()
            .then(() => tokenVal);
        }));
  };
}

TokenService.prototype.constructor = TokenService;

module.exports = function(ctx) {
  return new TokenService(ctx);
};
