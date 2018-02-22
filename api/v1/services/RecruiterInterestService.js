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

module.exports.findById = (id) => RecruiterInterest
  .findById(id)
  .then((result) => {
    if (_.isNull(result)) {
      const message = 'An interest with the given ID cannot be found';
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

module.exports.createInterest = (recruiterId, attendeeId, comments, favorite) => {
  if (_.isUndefined(comments)) {
    comments = "";
  }
  if (_.isUndefined(favorite)) {
    favorite = 0;
  }

  const interest = RecruiterInterest.forge({
    recruiterId: recruiterId,
    attendeeId: attendeeId,
    comments: comments,
    favorite: favorite
  });

  return interest
    .validate()
    .catch(utils.errors.handleValidationError)
    .then(() => interest.save());
};

module.exports.updateInterest = (id, comments, favorite) => RecruiterInterest
  .updateInterest(id, comments, favorite)
  .then((result) => {
    if (_.isNull(result)) {
      const message = 'An application with the given ID cannot be found';
      const source = 'id';
      throw new errors.NotFoundError(message, source);
    }
    return _Promise.resolve(result);
  });
