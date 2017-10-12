const bodyParser = require('body-parser');

const errors = require('../errors');
const middleware = require('../middleware');
const requests = require('../requests');
const utils = require('../utils');

const AuthService = require('../services').AuthService;
const TokenService = require('../services').TokenService;
const UserService = require('../services').UserService;

const router = require('express').Router();

/**
 * Issues a token using the provided email address,
 * optionally checking a password against the associated
 * user's password
 * @param  {String} email    a user's email address
 * @param  {String} password the associated user's password (optional)
 * @return {Promise} a promise resolving to an auth token
 * @throws {NotFoundError} when there is no user associated with the email
 * @throws {InvalidParameterError} when the provided password is incorrect
 */
function _issueByEmail(email, password) {
  return UserService
    .findUserByEmail(email)
    .then((user) => {
      if (!password) {
        return AuthService.issueForUser(user);
      }

      return UserService
        .verifyPassword(user, password)
        .then(() => AuthService.issueForUser(user));
    });
}

function createToken(req, res, next) {
  // the requester must have a valid password to receive a new token
  _issueByEmail(req.body.email, req.body.password)
    .then((auth) => {
      res.body = {};
      res.body.auth = auth;

      return next();
    })
    .catch((error) => next(error));
}

function getGitHubAuthToken(req, res, next) {
  res.redirect(AuthService.getGitHubSessionCodeURL());
  return next();
}

function getGitHubAccessToken(req, res, next) {
  AuthService.requestGitHubAccessToken(req.query.code)
  .then((gitLogin) => {
    res.body = {
      auth: gitLogin
    };

    return next();
  })
  .catch((error) => next(error));
}

function refreshToken(req, res, next) {
  if (!req.auth) {
    const message = 'A refresh token cannot be issued without a valid token';
    return next(new errors.InvalidHeaderError(message));
  }

  // the requester's token must be valid and present, so we can re-issue
  // without requiring a password
  _issueByEmail(req.user.email)
    .then((auth) => {
      res.body = {};
      res.body.auth = auth;

      return next();
    })
    .catch((error) => next(error));
}

function passwordReset(req, res, next) {
  TokenService
    .findTokenByValue(req.body.token, utils.scopes.AUTH)
    .then((token) => {
      token.destroy();
      return UserService.resetPassword(token.related('user'), req.body.password);
    })
    .then((user) => AuthService.issueForUser(user))
    .then((auth) => {
      res.body = {};
      res.body.auth = auth;
      return next();
    })
    .catch((error) => next(error));
}

router.use(bodyParser.json());
router.use(middleware.auth);

router.post('/', middleware.request(requests.BasicAuthRequest), createToken);
router.get('/refresh', refreshToken);
router.post('/reset', middleware.request(requests.ResetPasswordRequest), passwordReset);

router.get('/', getGitHubAuthToken);
router.get('/github', getGitHubAccessToken);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.createToken = createToken;
module.exports.router = router;
