const express = require('express');
const v1 = express.Router();

const controllers = require('./controllers');
const utils = require('./utils');
const middleware = require('./middleware');

// acknowledge receipt of request
v1.use((req, res, next) => {
  utils.logs.logRequestReceipt(req);
  next();
});

v1.use(middleware.ratelimiting);

// set up CORS to allow for usage from different origins
// we may remove this in the future
v1.all('*', (req, res, next) => {
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
v1.use('/application', controllers.JobApplicationController.router);

// logs resolved requests (the request once processed by various middleware) and outgoing responses
v1.use((req, res, next) => {
  utils.logs.logRequest(req);
  utils.logs.logResponse(req, res);
  next();
});

module.exports = v1;
