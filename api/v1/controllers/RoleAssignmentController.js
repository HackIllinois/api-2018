const bodyParser = require('body-parser');

const UserService = require('../services').UserService;

const errors = require('../errors');
const middleware = require('../middleware');
const RoleAssignmentRequest = require('../requests').RoleAssignmentRequest;
const roles = require('../utils/roles');

const router = require('express').Router();



//assigns new role and returns updatedUser
function assignNewRole(req, res, next) {
  UserService
    .findUserById(req.body.id)
    .then((assignedUser) => {
      if (UserService.canAssign(req.user, assignedUser, req.body.newRole
        ,req.originUser)) {

        UserService.addRole(assignedUser, req.body.role, true)
          .then(() => {
            UserService
              .findUserById(assignedUser.id)
              .then((updatedUser) => {
                let updatedUserJson = updatedUser.toJSON();
                updatedUserJson.roles = updatedUser.related("roles").toJSON();
                res.body = updatedUserJson;
                return next();
              })
              .catch((error) => next(error));
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
