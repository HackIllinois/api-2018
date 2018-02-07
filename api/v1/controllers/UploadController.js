/* jshint esversion: 6 */

// NOTE this controller is mostly example code that demonstrates how to use
// the storage service to permit the uploading of resumes to the API (1 per user).
// it is expected that this code will be refactored into the registration service
// after being merged

const bodyParser = require('body-parser');
const router = require('express').Router();

const errors = require('../errors');
const middleware = require('../middleware');
const services = require('../services');
const utils = require('../utils');
const roles = require('../utils/roles');

const Upload = require('../models/Upload');
const UploadRequest = require('../requests/UploadRequest');

const UPLOAD_ALREADY_PRESENT = 'An upload has already been associated with this user';

const RESUME_UPLOAD_LIMIT = '2mb';
const RESUME_UPLOAD_TYPE = 'application/pdf';
const RESUME_BUCKET = utils.storage.buckets.resumes;

function _findUpload(req, res, next) {
  return services.StorageService.findUploadById(req.params.id)
    .then((upload) => {
      req.upload = upload;

      return next();
    })
    .catch((error) => next(error));
}

function _isOwner(req) {
  return req.upload.get('ownerId') === req.user.get('id');
}

function _allowInactiveNonProfessional(req) {
  return req.user.hasRoles(roles.NON_PROFESSIONALS, false);
}

function _makeFileParams(req) {
  return {
    content: req.body,
    type: req.header('content-type')
  };
}

function createResumeUpload(req, res, next) {
  const uploadOwner = req.user;
  const uploadParams = {
    bucket: RESUME_BUCKET
  };

  Upload.findByOwner(uploadOwner, uploadParams.bucket)
    .then((results) => {
      if (results.length) {
        throw new errors.ExistsError(UPLOAD_ALREADY_PRESENT);
      }


    })
    .then(() => services.StorageService.createUpload(uploadOwner, uploadParams))
    .tap((newUpload) => {
      const fileParams = _makeFileParams(req);
      return services.StorageService.persistUpload(newUpload, fileParams);
    })
    .then((newUpload) => {
      res.body = newUpload.toJSON();

      return next();
    })
    .catch((error) => next(error));
}

function replaceResumeUpload(req, res, next) {
  return req.upload.save()
    .then((upload) => {
      const fileParams = _makeFileParams(req, RESUME_UPLOAD_TYPE);
      return services.StorageService.persistUpload(upload, fileParams);
    })
    .then(() => {
      res.body = req.upload.toJSON();

      return next();
    })
    .catch((error) => next(error));
}

function getUpload(req, res, next) {
  return services.StorageService.getUpload(req.upload)
    .then((result) => {
      res.set('Content-Length', result.content.length);
      res.set('Content-Type', result.type);

      res.send(result.content);

      return next();
    })
    .catch((error) => next(error));
}

router.use(middleware.auth);

router.use(bodyParser.raw({
  limit: RESUME_UPLOAD_LIMIT,
  type: RESUME_UPLOAD_TYPE
}));

router.post('/resume/', middleware.request(UploadRequest), middleware.upload,
  middleware.permission(utils.roles.NON_PROFESSIONALS, _allowInactiveNonProfessional), createResumeUpload);
router.put('/resume/:id(\\d+)', middleware.request(UploadRequest), middleware.upload,
  _findUpload, middleware.permission(utils.roles.NONE, _isOwner), replaceResumeUpload);
router.get('/resume/:id(\\d+)', _findUpload, middleware.permission(utils.roles.ORGANIZERS, _isOwner), getUpload);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
