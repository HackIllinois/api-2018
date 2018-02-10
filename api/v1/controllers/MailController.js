const _ = require('lodash');
const bodyParser = require('body-parser');
const _Promise = require('bluebird');

const services = require('../services');
const middleware = require('../middleware');
const requests = require('../requests');
const roles = require('../utils/roles');
const config = require('ctx').config();

const router = require('express').Router();

const ACCEPTANCE_LISTS = ['wave1', 'wave2', 'wave3', 'wave4', 'wave5'];

function sendMailinglist(req, res, next) {
  const listName = req.body.listName;
  const mailList = config.mail.lists[listName];
  const template = req.body.template;

  services.MailService.checkIfSent(mailList)
    .then(() => services.MailService.sendToList(mailList, template))
    .then(() => {
      if (_.includes(ACCEPTANCE_LISTS, listName)) {
        return services.MailService.markAsSent(mailList);
      }
      return _Promise.resolve(true);
    })
    .then(() => {
      res.body = {};
      res.body.sent = true;

      return next();
    })
    .catch((error) => next(error));
}


router.use(bodyParser.json());
router.use(middleware.auth);

router.put('/send', middleware.request(requests.SendListRequest), middleware.permission(roles.ORGANIZERS), sendMailinglist);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
