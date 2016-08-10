/* jshint esversion: 6 */

var ExpressRouter = require('express').Router;
var bodyParser = require('body-parser');
var _Promise = require('bluebird');
var _ = require('lodash');

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

// in order to protect ourselves, we create a router for every type of upload
// that we need to handle. this allows us to place a limit on the incoming buffer
var router = ExpressRouter();
var resumeRouter = ExpressRouter();

function isOwner (req) {
	return services.StorageService.findUploadById(req.params.id)
		.then(function (upload) {
			req.upload = upload;
			return _Promise.resolve(upload.get('ownerId') === parseInt(req.auth.sub));
		});
}

function _makeFileParams (req, type) {
	return { content: req.body, type: type, name: req.header('x-content-name') };
}

function createResumeUpload (req, res, next) {
	var upload;
	var uploadOwner = User.forge({ id: parseInt(req.auth.sub) }); // NOTE: this will soon be present on the actual auth object
	var uploadParams = { bucket: RESUME_BUCKET };

	Upload.findByOwner(uploadOwner, uploadParams.bucket)
		.then(function (results) {
			if (!_.isEmpty(results)) {
				return next(new errors.InvalidUploadError(UPLOAD_ALREADY_PRESENT));
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

// since we are using individual sub-routers, we cannot use the request middleware
// until after we have attached the individual body parsers (otherwise req.body will be undefined)
router.use(middleware.auth);

// add sub-routers to main router (sub-routes will be set-up below)
router.use('/resume', resumeRouter);

// add the general error-handling and response middleware that all routers use
router.use(middleware.response);
router.use(middleware.errors);

// set up individual sub-routers, starting with the body parser and then moving on
// to request-handling middleware (see above for reasoning)
resumeRouter.use(bodyParser.raw({ limit: RESUME_UPLOAD_LIMIT, type: RESUME_UPLOAD_TYPE }));
resumeRouter.use(middleware.request);

resumeRouter.post('/', middleware.permission(utils.roles.NON_PROFESSIONALS), createResumeUpload);
resumeRouter.put('/:id', middleware.permission(utils.roles.NONE, isOwner), replaceResumeUpload);
resumeRouter.get('/:id', middleware.permission(utils.roles.ORGANIZERS, isOwner), getResumeUpload);

module.exports.router = router;
