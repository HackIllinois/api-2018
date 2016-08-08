/* jshint esversion: 6 */

// NOTE: this is an example controller that will be used to handle resume
// uploads (it is currently a WIP)

var _Promise = require('bluebird');
var _ = require('lodash');

var errors = require('../errors');
var middleware = require('../middleware');
var services = require('../services');
var utils = require('../utils');

var Upload = require('../models/Upload');

// TODO move all constant definitions to service
const UPLOAD_EXPIRATION = 10; // in seconds

const RESUME_KEY_SEPARATOR = '/';
const RESUME_KEY_IDENTIFIER = 'RESUME';
const RESUME_BUCKET = utils.storage.buckets.resumes;
const RESUME_MAX_LENGTH = 2 * 1000 * 1000; // bytes
const RESUME_FILE_TYPES = [utils.storage.types.pdf];

var router = require('express').Router();

function isOwner (req) {
	return services.StorageService
		.findById(req.params.id)
		.then(function (upload) {
			req.upload = upload;
			return _Promise.resolve(upload.get('owner_id') == req.params.id);
		});
}

function _makeResumeKey (user) {
	return user.get('id') + RESUME_KEY_SEPARATOR + RESUME_KEY_IDENTIFIER;
}

function _getResumeUploadUri (upload, fileParams) {
	var uploadParams = { allowedTypes: RESUME_FILE_TYPES, maxLength: RESUME_MAX_LENGTH };
	return services.StorageService.receive(upload, fileParams, uploadParams);
}

function createUpload(req, res, next) {
	// TODO refactor into service
	var newUpload;
	var uploadOwner = User.forge({ id: req.auth.id });
	var uploadParams = { bucket: RESUME_BUCKET, key: _makeResumeKey(uploadOwner) };

	Upload
		.findByKey(uploadParams.key, uploadParams.bucket)
		.then(function (result) {
			if (!_.isNull(result)) {
				var message = "A resume has already been associated with this user";
				next(new InvalidUploadError(message));
			}

			return null;
		})
		.then(function () {
			return services.StorageService.createUpload(uploadOwner, uploadParams);
		})
		.then(function (upload) {
			newUpload = upload;
			return _getResumeUploadUri(upload, req.body);
		})
		.then(function (uploadUri) {
			res.body = newUpload.toJSON();
			res.body.transfer = uploadUri;
			res.body.retrieve = null;

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
		});
}

function updateUpload(req, res, next) {
	// TODO refactor into service
	var updatedUpload;
	var uploadOwner = User.forge({ id: req.auth.id });
	var uploadParams = { bucket: RESUME_BUCKET, key: _makeResumeKey(uploadOwner) };

	StorageService
		.findById(req.params.id)
		.then(function (upload) {
			// update the timestamp
			upload.save();
		})
		.then(function (upload) {
			updatedUpload = upload;
			return _getResumeUploadUri(upload, req.body);
		})
		.then(function (uploadUri) {
			res.body = updatedUpload.toJSON();
			res.body.transfer = uploadUri;
			res.body.retrieve = null;

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
		});
}

function getUpload(req, res, next) {
	var existingUpload;

	StorageService
		.findById(req.params.id)
		.then(function (upload) {
			existingUpload = upload;
			return StorageService.getUpload(upload);
		})
		.then(function (retrievalUri) {
			res.body = existingUpload.toJSON();
			res.body.transfer = null;
			res.body.retrieve = retrievalUri;

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
		});
}

router.post('/', middleware.permission(utils.roles.NON_PROFESSIONALS), createUpload);
router.put('/:id', middleware.permission(utils.roles.NONE, isOwner), updateUpload);
router.get('/:id', middleware.permission(utils.roles.ORGANIZERS, isOwner), getUpload);

module.exports.createUpload = createUpload;
module.exports.updateUpload = updateUpload;
module.exports.getUpload = getUpload;
module.exports.router = router;
