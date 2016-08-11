var express = require('express');
var v1 = express.Router();

// set up CORS to allow for usage from different origins
// we may remove this in the future
v1.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type, Content-Length, X-Content-Name');
	next();
});


var controllers = require('./controllers');
v1.use('/auth', controllers.AuthController.router);
v1.use('/user', controllers.UserController.router);
v1.use('/upload', controllers.UploadController.router);

module.exports = v1;
