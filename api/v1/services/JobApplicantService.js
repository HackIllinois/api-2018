const _Promise = require('bluebird');
const _ = require('lodash');

const JobApplicant = require('../models/JobApplicant');
const errors = require('../errors');
const utils = require('../utils');

module.exports.findByRecruiterId = (recruiterId) => JobApplicant
  .findByRecruiterId(recruiterId)
  .then((result) => {
    if (_.isNull(result)) {
      const message = 'A recruiter with the given ID cannot be found';
      const source = 'id';
      throw new errors.NotFoundError(message, source);
    }
    return _Promise.resolve(result);
  });

module.exports.findByAppId = (appId) => JobApplicant
  .findByRecruiterId(appId)
  .then((result) => {
    if (_.isNull(result)) {
      const message = 'An application with the given ID cannot be found';
      const source = 'id';
      throw new errors.NotFoundError(message, source);
    }
    return _Promise.resolve(result);
  });

module.exports.findByApplicantId = (applicantId) => JobApplicant
  .findByApplicantId(applicantId)
  .then((result) => {
    if (_.isNull(result)) {
      const message = 'An applicant with the given ID cannot be found';
      const source = 'id';
      throw new errors.NotFoundError(message, source);
    }
    return _Promise.resolve(result);
  });

module.exports.createApplication = (recruiterId, applicantId, comments, favorite) => {
  if (!comments) {
    comments = "";
  }
  if (!favorite) {
    favorite = 0;
  }
  const application = JobApplicant.forge({
    recruiterId: recruiterId,
    applicantId: applicantId,
    comments: comments,
    favorite: favorite
  });

  return application
    .validate()
    .catch(utils.errors.handleValidationError)
    .then(() => application.save());
};
