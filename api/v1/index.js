var express = require('express');
var v1 = express.Router();

var controllers = require('./controllers');
var utils = require('./utils');

// log any incoming requests for debugging
v1.use(function(req, res, next) {
	utils.logs.logRequest(req);
	next();
});

// set up CORS to allow for usage from different origins
// we may remove this in the future
v1.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type, Content-Length');
	next();
});

v1.use('/auth', controllers.AuthController.router);
v1.use('/user', controllers.UserController.router);
v1.use('/upload', controllers.UploadController.router);
v1.use('/registration', controllers.RegistrationController.router);
v1.use('/permission', controllers.PermissionController.router);
v1.use('/project', controllers.ProjectController.router);
v1.use('/ecosystem', controllers.EcosystemController.router);
v1.use('/health', controllers.HealthController.router);
v1.use('/checkin', controllers.CheckInController.router);
v1.use('/rsvp', controllers.RSVPController.router);
v1.use('/announcement', controllers.AnnouncementController.router);
v1.use('/stats', controllers.StatsController.router);
v1.use('/tracking', controllers.TrackingController.router);
v1.use('/mail', controllers.MailController.router);
v1.use('/event', controllers.EventController.router);

// log any outgoing response for debugging
v1.use(function (req, res, next) {
	utils.logs.logResponse(req, res);
	next();
});

module.exports = v1;
