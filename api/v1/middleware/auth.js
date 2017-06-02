const AuthService = require('../services/AuthService');
const User = require('../models/User');
const config = require('../../config');
const errors = require('../errors');

const AUTH_HEADER = config.auth.header;

module.exports = (req, res, next) => {
  const auth = req.header(AUTH_HEADER);

  if (!auth) {
    return next();
  }

  return AuthService.verify(auth)
    .then((decoded) => {
      // specifies that request supplied a valid auth token
      // (but not necessarily that the associated user data has been retrieved)
      req.auth = true;

      return User.findById(decoded.sub);
    })
    .then((user) => {
      req.user = user;

      return next();
    })
    .catch(errors.UnprocessableRequestError, (error) => {
      const message = 'The provided token was invalid (' + error.message + ')';
      const source = AUTH_HEADER;

      return next(new errors.InvalidHeaderError(message, source));
    });
};
