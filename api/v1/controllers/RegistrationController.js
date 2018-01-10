const _ = require('lodash');
const bodyParser = require('body-parser');
const _Promise = require('bluebird');

const services = require('../services');
const middleware = require('../middleware');
const requests = require('../requests');
const roles = require('../utils/roles');
const config = require('../../config');
const errors = require('../errors');

const attendeeQueryCategories = ['firstName', 'lastName', 'graduationYear', 'school', 'status', 'wave', 'finalized'];

const router = require('express')
  .Router();

function _isAuthenticated(req) {
  return req.auth && (req.user !== undefined);
}

function _validateGetAttendeesRequest(page, count, category, ascending) {
  if (_.isNaN(page)) {
    const message = 'Invalid page parameter';
    const source = 'page';
    return _Promise.reject(new errors.InvalidParameterError(message, source));
  }
  if (_.isNaN(count)) {
    const message = 'Invalid count parameter';
    const source = 'count';
    return _Promise.reject(new errors.InvalidParameterError(message, source));
  }
  if (_.isNaN(ascending) || (ascending !== 0 && ascending != 1)) {
    const message = 'Invalid ascending parameter';
    const source = 'ascending';
    return _Promise.reject(new errors.InvalidParameterError(message, source));
  }
  if (_.isNaN(category) || !_.includes(attendeeQueryCategories, category)) {
    const message = 'Invalid category parameter';
    const source = 'category';
    return _Promise.reject(new errors.InvalidParameterError(message, source));
  }
  return _Promise.resolve(true);
}

function _deleteExtraAttendeeParams(req) {
  // NOTE this can be removed when we marshal recursively
  delete req.body.attendee.status;
  delete req.body.attendee.wave;
  delete req.body.attendee.priority;
  delete req.body.attendee.reviewer;
  delete req.body.attendee.reviewTime;
  delete req.body.attendee.acceptedEcosystemId;
  delete req.body.attendee.acceptanceType;
  return req;
}

function createMentor(req, res, next) {
  delete req.body.status;

  services.RegistrationService.createMentor(req.user, req.body)
    .then((mentor) => {
      res.body = mentor.toJSON();

      return next();
    })
    .catch((error) => next(error));
}

function fetchMentorByUser(req, res, next) {
  services.RegistrationService
    .findMentorByUser(req.user)
    .then((mentor) => {
      res.body = mentor.toJSON();

      return next();
    })
    .catch((error) => next(error));
}

function fetchMentorById(req, res, next) {
  services.RegistrationService.findMentorById(req.params.id)
    .then((mentor) => {
      res.body = mentor.toJSON();

      return next();
    })
    .catch((error) => next(error));
}

function updateMentorByUser(req, res, next) {
  delete req.body.mentor.id;
  if (!req.user.hasRoles(roles.ORGANIZERS)) {
    delete req.body.status;
  }

  services.RegistrationService
    .findMentorByUser(req.user)
    .then((mentor) => services.RegistrationService.updateMentor(mentor, req.body))
    .then((mentor) => {
      res.body = mentor.toJSON();

      return next();
    })
    .catch((error) => next(error));
}

function updateMentorById(req, res, next) {
  delete req.body.mentor.id;
  if (!req.user.hasRoles(roles.ORGANIZERS)) {
    delete req.body.status;
  }

  services.RegistrationService
    .findMentorById(req.params.id)
    .then((mentor) => services.RegistrationService.updateMentor(mentor, req.body))
    .then((mentor) => {
      res.body = mentor.toJSON();

      return next();
    })
    .catch((error) => next(error));
}


function createAttendee(req, res, next) {
  req = _deleteExtraAttendeeParams(req);

  services.RegistrationService.createAttendee(req.user, req.body)
    .then((attendee) => {
      services.MailService.addToList(req.user, config.mail.lists.applicants);
      res.body = attendee.toJSON();

      return next();
    })
    .catch((error) => next(error));
}

function fetchAttendeeByUser(req, res, next) {
  services.RegistrationService
    .findAttendeeByUser(req.user, true)
    .then((attendee) => {
      res.body = attendee.toJSON();
      delete res.body.reviewer;

      return next();
    })
    .catch((error) => next(error));
}

function fetchAttendeeById(req, res, next) {
  services.RegistrationService.findAttendeeById(req.params.id, true)
    .then((attendee) => {
      res.body = attendee.toJSON();

      return next();
    })
    .catch((error) => next(error));
}

function updateAttendeeByUser(req, res, next) {
  delete req.body.attendee.id;
  req = _deleteExtraAttendeeParams(req);

  services.RegistrationService
    .findAttendeeByUser(req.user)
    .then((attendee) => services.RegistrationService.updateAttendee(attendee, req.body))
    .then((attendee) => {
      res.body = attendee.toJSON();
      delete res.body.reviewer;

      return next();
    })
    .catch((error) => next(error));
}

function updateAttendeeById(req, res, next) {
  delete req.body.attendee.id;
  req = _deleteExtraAttendeeParams(req);

  services.RegistrationService
    .findAttendeeById(req.params.id)
    .then((attendee) => services.RegistrationService.updateAttendee(attendee, req.body))
    .then((attendee) => {
      res.body = attendee.toJSON();

      return next();
    })
    .catch((error) => next(error));
}

function updateAttendeeDecision(req, res, next) {
  services.RegistrationService
    .findAttendeeById(req.params.id)
    .then((attendee) => {
      req.body.reviewer = req.user.get('email');
      req.body.reviewTime = new Date();
      return services.RegistrationService.applyDecision(attendee, req.body);
    })
    .then((attendee) => {
      res.body = attendee.toJSON();

      return next();
    })
    .catch((error) => next(error));
}

function getAttendeeBatch(req, res, next) {
  _.defaults(req.query, {
    'page': 1,
    'count': 25,
    'category': 'firstName',
    'ascending': 1
  });
  const page = parseInt(req.query.page);
  const count = parseInt(req.query.count);
  const category = req.query.category;
  const ascending = parseInt(req.query.ascending);

  _validateGetAttendeesRequest(page, count, category, ascending)
    .then(() => services.RegistrationService.fetchAllAttendees(page, count, category, ascending))
    .then((results) => {
      res.body = {};
      res.body.attendees = results;

      return next();
    })
    .catch((error) => next(error));
}

function searchAttendees(req, res, next) {
  _.defaults(req.query, {
    'page': 1,
    'count': 25,
    'category': 'firstName',
    'ascending': 1
  });
  const page = parseInt(req.query.page);
  const count = parseInt(req.query.count);
  const category = req.query.category;
  const ascending = parseInt(req.query.ascending);
  const query = req.query.query;

  _validateGetAttendeesRequest(page, count, category, ascending)
    .then(() => {
      if (_.isUndefined(query)) {
        const message = 'Invalid query parameter';
        const source = 'query';
        return _Promise.reject(new errors.InvalidParameterError(message, source));
      }
      return _Promise.resolve(true);
    })
    .then(() => services.RegistrationService.findAttendeesByName(page, count, category, ascending, query))
    .then((results) => {
      res.body = {};
      res.body.attendees = results;

      return next();
    })
    .catch((error) => next(error));
}

function filterAttendees(req, res, next) {
  _.defaults(req.query, {
    'page': 1,
    'count': 25,
    'category': 'firstName',
    'ascending': 1
  });
  const page = parseInt(req.query.page);
  const count = parseInt(req.query.count);
  const category = req.query.category;
  const ascending = parseInt(req.query.ascending);
  const filterCategory = req.query.filterCategory;
  const filterVal = req.query.filterVal;

  _validateGetAttendeesRequest(page, count, category, ascending)
    .then(() => {
      if (_.isUndefined(filterCategory) || !_.includes(attendeeQueryCategories, category)) {
        const message = 'Invalid filterCategory parameter';
        const source = 'filterCategory';
        return _Promise.reject(new errors.InvalidParameterError(message, source));
      }
      if (_.isUndefined(filterVal)) {
        const message = 'Invalid filterVal parameter';
        const source = 'filterVal';
        return _Promise.reject(new errors.InvalidParameterError(message, source));
      }
      return _Promise.resolve(true);
    })
    .then(() => services.RegistrationService.filterAttendees(page, count, category, ascending, filterCategory, filterVal))
    .then((results) => {
      res.body = {};
      res.body.attendees = results;

      return next();
    })
    .catch((error) => next(error));
}

function fetchAttendeeForHost(req, res, next) {
  services.UserService.findUserById(req.params.id)
    .then((user) => services.RegistrationService.findAttendeeByUser(user, false))
    .then((attendee) => {
      res.body = {};
      res.body.firstName = attendee.get('firstName');
      res.body.lastName = attendee.get('lastName');
      res.body.shirtSize = attendee.get('shirtSize');
      res.body.diet = attendee.get('diet');
      res.body.status = attendee.get('status');
      res.body.school = attendee.get('school');
      res.body.acceptanceType = attendee.get('acceptanceType');
      res.body.acceptedEcosystemId = attendee.get('acceptedEcosystemId');

      return next();
    })
    .catch((error) => next(error));
}

router.use(bodyParser.json());
router.use(middleware.auth);

router.post('/mentor', middleware.request(requests.MentorRequest),
  middleware.permission(roles.NONE, _isAuthenticated), createMentor);
router.get('/mentor', middleware.permission(roles.MENTOR), fetchMentorByUser);
router.get('/mentor/:id(\\d+)', middleware.permission(roles.ORGANIZERS), fetchMentorById);
router.put('/mentor', middleware.request(requests.MentorRequest),
  middleware.permission(roles.MENTOR), updateMentorByUser);
router.put('/mentor/:id(\\d+)', middleware.request(requests.MentorRequest),
  middleware.permission(roles.ORGANIZERS), updateMentorById);

router.post('/attendee', middleware.request(requests.AttendeeRequest),
  middleware.permission(roles.NONE, _isAuthenticated), createAttendee);
router.get('/attendee', middleware.permission(roles.ATTENDEE), fetchAttendeeByUser);
router.get('/attendee/all', middleware.permission(roles.ORGANIZERS), getAttendeeBatch);
router.get('/attendee/search', middleware.permission(roles.ORGANIZERS), searchAttendees);
router.get('/attendee/filter', middleware.permission(roles.ORGANIZERS), filterAttendees);
router.get('/attendee/:id(\\d+)', middleware.permission(roles.ORGANIZERS), fetchAttendeeById);
router.put('/attendee', middleware.request(requests.AttendeeRequest),
  middleware.permission(roles.ATTENDEE), updateAttendeeByUser);
router.put('/attendee/decision/:id(\\d+)', middleware.request(requests.AttendeeDecisionRequest),
  middleware.permission(roles.ORGANIZERS), updateAttendeeDecision);
router.put('/attendee/:id(\\d+)', middleware.request(requests.AttendeeRequest),
  middleware.permission(roles.ORGANIZERS), updateAttendeeById);
router.get('/attendee/user/:id(\\d+)', middleware.permission(roles.HOSTS), fetchAttendeeForHost);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
