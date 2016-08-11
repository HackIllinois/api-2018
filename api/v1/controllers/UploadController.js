/* jshint esversion: 6 */

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

function isOwner (req) {
	return services.StorageService.findUploadById(req.params.id)
		.then(function (upload) {
			req.upload = upload;
			return _Promise.resolve(upload.get('ownerId') === parseInt(req.auth.sub));
		});
}

function _makeFileParams (req, type) {
	return { content: req.body, type: req.header('content-type'), name: req.header('x-content-name') };
}

function createResumeUpload (req, res, next) {
	var upload;
	var uploadOwner = User.forge({ id: parseInt(req.auth.sub) }); // NOTE: this will soon be present on the actual auth object
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

function getResumeUpload (req, res, next) {
	// TODO
	next();
}

// set up individual sub-routers to restrict upload size and type
// note that the request middleware is added after the body-parser, else there will be no body
var resumeRouter = ExpressRouter();
resumeRouter.use(bodyParser.raw({ limit: RESUME_UPLOAD_LIMIT, type: RESUME_UPLOAD_TYPE }));
resumeRouter.use(middleware.request);

resumeRouter.post('/', middleware.upload, middleware.permission(utils.roles.NON_PROFESSIONALS), createResumeUpload);
resumeRouter.put('/:id', middleware.upload, middleware.permission(utils.roles.NONE, isOwner), replaceResumeUpload);
resumeRouter.get('/:id', middleware.permission(utils.roles.ORGANIZERS, isOwner), getResumeUpload);

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
