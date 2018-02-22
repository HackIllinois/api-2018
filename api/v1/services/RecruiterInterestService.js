const _Promise = require('bluebird');
const _ = require('lodash');

const RecruiterInterest = require('../models/RecruiterInterest');
const errors = require('../errors');
const utils = require('../utils');

module.exports.findByRecruiterId = (recruiterId) => RecruiterInterest
  .findByRecruiterId(recruiterId)
  .then((result) => {
    if (_.isNull(result)) {
      const message = 'A recruiter with the given ID cannot be found';
      const source = 'id';
      throw new errors.NotFoundError(message, source);
    }
    return _Promise.resolve(result);
  });

module.exports.findByApplicationId = (appId) => RecruiterInterest
  .findByApplicationId(appId)
  .then((result) => {
    if (_.isNull(result)) {
      const message = 'An application with the given ID cannot be found';
      const source = 'id';
      throw new errors.NotFoundError(message, source);
    }
    return _Promise.resolve(result);
  });

module.exports.findByAttendeeId = (attendeeId) => RecruiterInterest
  .findByAttendeeId(attendeeId)
  .then((result) => {
    if (_.isNull(result)) {
      const message = 'An attendee with the given ID cannot be found';
      const source = 'id';
      throw new errors.NotFoundError(message, source);
    }
    return _Promise.resolve(result);
  });

module.exports.createApplication = (recruiterId, attendeeId, comments, favorite) => {
  if (!comments) {
    comments = "";
  }
  if (!favorite) {
    favorite = 0;
  }

  const application = RecruiterInterest.forge({
    recruiterId: recruiterId,
    attendeeId: attendeeId,
    comments: comments,
    favorite: favorite
  });

  return application
    .validate()
    .catch(utils.errors.handleValidationError)
    .then(() => application.save());
};

module.exports.updateApplication = (appId, comments, favorite) => RecruiterInterest
  .updateApplication(appId, comments, favorite)
  .then((result) => {
    if (_.isNull(result)) {
      const message = 'An application with the given ID cannot be found';
      const source = 'id';
      throw new errors.NotFoundError(message, source);
    }
    return _Promise.resolve(result);
  });
