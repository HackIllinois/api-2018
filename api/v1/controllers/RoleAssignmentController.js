const bodyParser = require('body-parser');

const UserService = require('../services').UserService;

const errors = require('../errors');
const middleware = require('../middleware');
const RoleAssignmentRequest = require('../requests').RoleAssignmentRequest;
const roles = require('../utils/roles');

const router = require('express').Router();

const ROLE_VALUE_MAP = {"ADMIN":2, "STAFF":1, "SPONSOR":0, "MENTOR":0, "VOLUNTEER":0, "ATTENDEE":0};

function maxRole(userRoles) {
  let max = 0;
  userRoles.forEach((roleObj) => {
    if(ROLE_VALUE_MAP[roleObj.role] > max) {
      max = ROLE_VALUE_MAP[roleObj.role];
    }
  });
  return max;
}

//assigns new role and returns updatedUser
function assignNewRole(req, res, next) {
  UserService
    .findUserById(req.body.id)
    .then((assignedUser) => {
      if(maxRole(req.user.related('roles').toJSON())
          > ROLE_VALUE_MAP[req.body.role]
          && maxRole(req.user.related('roles').toJSON())
          > maxRole(assignedUser.related('roles').toJSON())) {

        UserService.addRole(assignedUser, req.body.role, true)
        .then((updatedUser) => {
          res.body = updatedUser.toJSON();
          return next();
        })
        .catch((error) => next(error));
      } else {
        return next(new errors.UnauthorizedError());
      }
    })
    .catch((error) => next(error));
}


router.use(bodyParser.json());
router.use(middleware.auth);

router.post('/', middleware.request(RoleAssignmentRequest), middleware.permission(roles.ORGANIZERS), assignNewRole);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.assignNewRole = assignNewRole;
module.exports.router = router;
