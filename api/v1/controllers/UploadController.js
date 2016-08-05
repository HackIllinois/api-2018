/* jshint esversion: 6 */

// NOTE: this is an example controller that will be used to handle resume
// uploads (it is currently a WIP)

const MAX_CONCURRENT_REQUESTS = 1;
const UPLOAD_EXPIRATION = 15; // seconds (TODO move this to a service)

var _Promise = require('bluebird');

var errors = require('../errors');
var middleware = require('../middleware');
var services = require('../services');
var utils = require('../utils');

var Upload = require('../models/Upload');

var router = require('express').Router();

function isOwner(req) {
	return services.StorageService
		.findById(req.params.id)
		.then(function (upload) {
			req.upload = upload;
			return _Promise.resolve(upload.get('owner_id') == req.params.id);
		});
}

function resolveRequester(req) {
	return req.auth.id;
}

function upload(req, res, next) {
	// TODO refactor into service
	return Upload
		.where({ owner_id: req.auth.id, bucket: utils.storage.buckets.resumes })
		.fetchOne()
		.then(function (previousUpload) {
			// TODO check not null
			// TODO check previous upload to see if it is still active
			// TODO delete previous upload entry
			// TODO create signed upload URL
			// TODO create db upload entry
			// TODO release sync request 
		});
}

function getUpload(req, res, next) {
	next();
}

function deleteUpload(req, res, next) {
	next();
}

router.post('/',
	middleware.permission(utils.roles.ORGANIZERS.concat(utils.roles.HACKER)),
	middleware.synchronize(MAX_CONCURRENT_REQUESTS, resolveRequester), upload);
router.get('/:id', middleware.permission(utils.roles.ORGANIZERS, isOwner), getUpload);
router.delete('/:id', middleare.permission(utils.roles.ORGANIZERS), deleteUpload);

module.exports.upload = upload;
module.exports.getUpload = getUpload;
module.exports.deleteUpload = deleteUpload;
module.exports.router = router;
