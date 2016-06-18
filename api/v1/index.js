var express = require('express');

var controllers = require('./controllers');
var middleware = require('./middleware');

var v1 = express.Router();

v1.use(middleware.request);
v1.use(middleware.errors);

v1.use('/user', controllers.UserController.router);

module.exports = v1;
