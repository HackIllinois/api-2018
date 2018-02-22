const bodyParser = require('body-parser');

const services = require('../services');
const config = require('../../config');

const middleware = require('../middleware');
const requests = require('../requests');
const scopes = require('../utils/scopes');
const roles = require('../utils/roles');
const errors = require('../errors');

const router = require('express').Router();

/**
 * Determines whether or not the requester is requesting its own
 * user information
 * @param  {Request}  req an Express request with auth and parameter information
 * @return {Boolean} whether or not the requester is requesting itself
 */
function isRequester(req) {
  return req.user.get('id') == req.params.id;
}

function isAuthenticated(req) {
  return req.auth && (req.user !== undefined);
}

function createUser(req, res, next) {
  services.UserService
    .createUser(req.body.email, req.body.password)
    .then((user) => services.AuthService.issueForUser(user))
    .then((auth) => {
      res.body = {};
      res.body.auth = auth;

      return next();
    })
    .catch((error) => next(error));
}

function createAccreditedUser(req, res, next) {
  services.PermissionService
    .canCreateUser(req.user, req.body.role)
    .then(() => services.UserService
      .createUser(req.body.email, req.body.password, req.body.role))
    .then((user) => {
      res.body = user.toJSON();

      return next();
    })
    .catch((error) => next(error));
}

function getAuthenticatedUser(req, res, next) {
  services.UserService
    .findUserById(req.user.get('id'))
    .then((user) => {
      res.body = {
        user: user.toJSON(),
        roles: user.related('roles').toJSON()
      };

      return next();
    })
    .catch((error) => next(error));
}

function getUser(req, res, next) {
  services.UserService
    .findUserById(req.params.id)
    .then((user) => {
      res.body = {
        user: user.toJSON(),
        roles: user.related('roles').toJSON()
      };
      return next();
    })
    .catch((error) => next(error));
}

function getUserByEmail(req, res, next) {
  services.UserService
    .findUserByEmail(req.params.email)
    .then((user) => {
      res.body = user.toJSON();

      return next();
    })
    .catch((error) => next(error));
}

function getUserByGithubHandle(req, res, next) {
  services.UserService
    .findUserByGitHubHandle(req.params.handle)
    .then((user) => {
      res.body = user.toJSON();

      return next();
    })
    .catch((error) => next(error));
}

function requestPasswordReset(req, res, next) {
  services.UserService
    .findUserByEmail(req.body.email)
    .then((user) => services.TokenService.generateToken(user, scopes.AUTH))
    .then((tokenVal) => {
      const substitutions = {
        token: tokenVal,
        isDevelopment: config.isDevelopment
      };
      services.MailService.send(req.body.email, config.mail.templates.passwordReset, substitutions);
      return null;
    })
    .then(() => {
      res.body = {};
      return next();
    })
    .catch((error) => next(error));
}
function updateContactInfo(req, res, next) {
  services.UserService.updateContactInfo(req.user, req.body.newEmail)
  .then((result) => {
    res.body = result.toJSON();

    return next();
  })
  .catch((error) => next(error));
}

function assignNewRole(req, res, next) {
  services.UserService
    .findUserById(req.body.id)
    .then((assignedUser) => {
      if (services.UserService
        .canAssign(req.user, assignedUser, req.body.role, req.originUser)) {

        services.UserService.addRole(assignedUser, req.body.role, true)
          .then(() => {
            services.UserService
              .findUserById(assignedUser.id)
              .then((updatedUser) => {
                let updatedUserJson = updatedUser.toJSON();
                updatedUserJson.roles = updatedUser.related("roles").toJSON();
                res.body = updatedUserJson;
                return next();
              })
          })

      } else {
        return next(new errors.UnauthorizedError());
      }
    })
    .catch((error) => next(error));
}

router.use(bodyParser.json());
router.use(middleware.auth);

router.post('/', middleware.request(requests.BasicAuthRequest),
  middleware.permission(roles.ORGANIZERS), createUser);
router.post('/accredited', middleware.request(requests.AccreditedUserCreationRequest),
  middleware.permission(roles.ORGANIZERS), createAccreditedUser);
router.post('/reset', middleware.request(requests.ResetTokenRequest), requestPasswordReset);
router.get('/', middleware.permission(roles.NONE, isAuthenticated), getAuthenticatedUser);
router.get('/:id(\\d+)', middleware.permission(roles.HOSTS, isRequester), getUser);
router.get('/email/:email', middleware.permission(roles.HOSTS), getUserByEmail);
router.post('/assign', middleware.request(requests.RoleAssignmentRequest),
 middleware.permission(roles.ORGANIZERS), assignNewRole);
router.get('/github/:handle', middleware.permission(roles.HOSTS), getUserByGithubHandle);
router.put('/contactinfo', middleware.request(requests.UserContactInfoRequest),
  middleware.permission(roles.NONE, isAuthenticated), updateContactInfo);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.createUser = createUser;
module.exports.createAccreditedUser = createAccreditedUser;
module.exports.router = router;
