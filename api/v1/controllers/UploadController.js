/* jshint esversion: 6 */

// NOTE this controller is mostly example code that demonstrates how to use
// the storage service to permit the uploading of resumes to the API (1 per user).
// it is expected that this code will be refactored into the registration service
// after being merged

var bodyParser = require('body-parser');
var ExpressRouter = require('express').Router;
var _Promise = require('bluebird');

var errors = require('../errors');
var middleware = require('../middleware');
var services = require('../services');
var utils = require('../utils');

var Upload = require('../models/Upload');
var User = require('../models/User');

const UPLOAD_ALREADY_PRESENT = "An upload has already been associated with this user";

const RESUME_UPLOAD_LIMIT = '2mb';
const RESUME_UPLOAD_TYPE = 'application/pdf';
const RESUME_BUCKET = utils.storage.buckets.resumes;

function _findUpload(req, res, next) {
	return services.StorageService.findUploadById(req.params.id)
		.then(function (upload) {
			req.upload = upload;

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
		});
}

function _isOwner (req) {
	return req.upload.get('ownerId') === parseInt(req.auth.sub);
}

function _makeFileParams (req, type) {
	return { content: req.body, type: req.header('content-type') };
}

function createResumeUpload (req, res, next) {
	var upload;

	// NOTE: the user object will soon be present on the actual auth object instead
	// see issue #10
	var uploadOwner = User.forge({ id: parseInt(req.auth.sub) });
	var uploadParams = { bucket: RESUME_BUCKET };

	Upload.findByOwner(uploadOwner, uploadParams.bucket)
		.then(function (results) {
			if (results.length) {
				throw new errors.ExistsError(UPLOAD_ALREADY_PRESENT);
			}

			return null;
		})
		.then(function () {
			return services.StorageService.createUpload(uploadOwner, uploadParams);
		})
		.then(function (newUpload) {
			upload = newUpload;

			var fileParams = _makeFileParams(req, RESUME_UPLOAD_TYPE);
			return services.StorageService.persistUpload(upload, fileParams);
		})
		.then (function () {
			res.body = upload.toJSON();

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
		});
}

function replaceResumeUpload (req, res, next) {
	return req.upload.save()
		.then(function (upload) {
			var fileParams = _makeFileParams(req, RESUME_UPLOAD_TYPE);
			return services.StorageService.persistUpload(upload, fileParams);
		})
		.then(function () {
			res.body = req.upload.toJSON();

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
		});
}

function getUpload (req, res, next) {
	return services.StorageService.getUpload(req.upload)
		.then(function (result) {
			res.set('Content-Length', result.content.length);
			res.set('Content-Type', result.type);

			res.send(result.content);

			next();
			return null;
		}).catch(function (error) {
			next(error);
		});
}

// set up individual sub-routers to restrict upload size and type
// note that the request middleware is added after the body-parser, else there will be no body
var resumeRouter = ExpressRouter();
resumeRouter.use(bodyParser.raw({ limit: RESUME_UPLOAD_LIMIT, type: RESUME_UPLOAD_TYPE }));
resumeRouter.use(middleware.request);

resumeRouter.post('/', middleware.upload, middleware.permission(utils.roles.NON_PROFESSIONALS), createResumeUpload);
resumeRouter.put('/:id', middleware.upload, _findUpload, middleware.permission(utils.roles.NONE, _isOwner), replaceResumeUpload);
resumeRouter.get('/:id', _findUpload, middleware.permission(utils.roles.ORGANIZERS, _isOwner), getUpload);

// set up the primary router with just the auth middleware since the sub-routers
// will handle the request middleware
var router = ExpressRouter();
router.use(middleware.auth);

// add sub-routers and their respective routes
router.use('/resume', resumeRouter);

// add the general error-handling and response middleware at the end to make sure
// all sub-routers can use them implicitly
router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
