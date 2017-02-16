var _ = require('lodash');
var bodyParser = require('body-parser');
var _Promise = require('bluebird');

var services = require('../services');
var middleware = require('../middleware');
var requests = require('../requests');
var roles = require('../utils/roles');
var mail = require('../utils/mail');
var errors = require('../errors');

var router = require('express').Router();


var acceptanceLists = ["wave1", "wave2", "wave3", "wave4", "wave5"];


function sendMailinglist(req, res, next) {
	var listName = req.body.listName;
	var mailList = mail.lists[listName]
	var template = req.body.template;
	
	services.MailService.checkIfSent(mailList)
		.then(function () {
			return services.MailService.sendToList(mailList, template);
		})
		.then(function () {
			if(_.includes(acceptanceLists, listName)){
				return services.MailService.markAsSent(mailList);
			}
			return _Promise.resolve(true);
		})
		.then(function () {
			res.body = {};
			res.body.sent = true;

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}


router.use(bodyParser.json());
router.use(middleware.auth);

router.put('/send', middleware.request(requests.SendListRequest), 
	middleware.permission(roles.ORGANIZERS), sendMailinglist);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;