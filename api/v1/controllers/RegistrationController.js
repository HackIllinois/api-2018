var _ = require('lodash');
var bodyParser = require('body-parser');
var _Promise = require('bluebird');

var services = require('../services');
var middleware = require('../middleware');
var requests = require('../requests');
var roles = require('../utils/roles');
var mail = require('../utils/mail');
var registration = require('../utils/registration');
var errors = require('../errors');


var router = require('express').Router();

function _isAuthenticated (req) {
	return req.auth && (req.user !== undefined);
}

function _validateGetAttendeesRequest(page, count, category, ascending){
	var message, source;
	if(_.isNaN(page)){
		message = "Invalid page parameter";
		source = "page";
		return _Promise.reject(new errors.InvalidParameterError(message, source));
	}
	if(_.isNaN(count)){
		message = "Invalid count parameter";
		source = "count";
		return _Promise.reject(new errors.InvalidParameterError(message, source));
	}
	if(_.isNaN(ascending) || (ascending !== 0 && ascending != 1)){
		message = "Invalid ascending parameter";
		source = "ascending";
		return _Promise.reject(new errors.InvalidParameterError(message, source));
	}
	if(_.isNaN(category) || !registration.verifyCategory(category)){
		message = "Invalid category parameter";
		source = "category";
		return _Promise.reject(new errors.InvalidParameterError(message, source));
	}
	return _Promise.resolve(true);
}

function _deleteExtraAttendeeParams (req) {
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
		.then(function (mentor) {
			res.body = mentor.toJSON();

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

function fetchMentorByUser(req, res, next) {
	services.RegistrationService
		.findMentorByUser(req.user)
		.then(function(mentor){
			res.body = mentor.toJSON();

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

function fetchMentorById(req, res, next) {
	services.RegistrationService.findMentorById(req.params.id)
		.then(function(mentor){
			res.body = mentor.toJSON();

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

function updateMentorByUser(req, res, next) {
	delete req.body.mentor.id;
	if (!req.user.hasRoles(roles.ORGANIZERS)) {
		delete req.body.status;
	}

	services.RegistrationService
		.findMentorByUser(req.user)
		.then(function (mentor) {
			return services.RegistrationService.updateMentor(mentor, req.body);
		})
		.then(function(mentor){
			res.body = mentor.toJSON();

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

function updateMentorById(req, res, next) {
	delete req.body.mentor.id;
	if (!req.user.hasRoles(roles.ORGANIZERS)) {
		delete req.body.status;
	}

	services.RegistrationService
		.findMentorById(req.params.id)
		.then (function (mentor) {
			return services.RegistrationService.updateMentor(mentor, req.body);
		})
		.then(function (mentor) {
			res.body = mentor.toJSON();

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}


function createAttendee(req, res, next) {
	req = _deleteExtraAttendeeParams(req);

	services.RegistrationService.createAttendee(req.user, req.body)
		.then(function (attendee) {
			services.MailService.addToList(req.user, mail.lists.applicants);
			res.body = attendee.toJSON();

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

function fetchAttendeeByUser(req, res, next) {
	services.RegistrationService
		.findAttendeeByUser(req.user, true)
		.then(function(attendee){
			res.body = attendee.toJSON();
			delete res.body.reviewer;

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

function fetchAttendeeById(req, res, next) {
	services.RegistrationService.findAttendeeById(req.params.id, true)
		.then(function(attendee){
			res.body = attendee.toJSON();

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

function updateAttendeeByUser(req, res, next) {
	delete req.body.attendee.id;
	req = _deleteExtraAttendeeParams(req);

	services.RegistrationService
		.findAttendeeByUser(req.user)
		.then(function (attendee) {
			return services.RegistrationService.updateAttendee(attendee, req.body);
		})
		.then(function(attendee){
			res.body = attendee.toJSON();
			delete res.body.reviewer;

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

function updateAttendeeById(req, res, next) {
	delete req.body.attendee.id;
	req = _deleteExtraAttendeeParams(req);

	services.RegistrationService
		.findAttendeeById(req.params.id)
		.then (function (attendee) {
			return services.RegistrationService.updateAttendee(attendee, req.body);
		})
		.then(function (attendee) {
			res.body = attendee.toJSON();

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

function updateAttendeeDecision (req, res, next) {
	services.RegistrationService
		.findAttendeeById(req.params.id)
		.then (function (attendee) {
			req.body.reviewer = req.user.get('email');
			req.body.reviewTime = new Date();
			return services.RegistrationService.applyDecision(attendee, req.body);
		})
		.then(function (attendee) {
			res.body = attendee.toJSON();

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

function getAttendeeBatch(req, res, next) {
	_.defaults(req.query, {'page': 1, 'count': 25, 'category': 'firstName', 'ascending': 1});
	var page = parseInt(req.query.page);
	var count = parseInt(req.query.count);
	var category = req.query.category;
	var ascending = parseInt(req.query.ascending);

	_validateGetAttendeesRequest(page, count, category, ascending)
		.then(function () {
			return services.RegistrationService.fetchAllAttendees(page, count, category, ascending);
		})
		.then(function (results) {
			res.body = {};
			res.body.attendees = results;

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

function searchAttendees(req, res, next) {
	_.defaults(req.query, {'page': 1, 'count': 25, 'category': 'firstName', 'ascending': 1});
	var page = parseInt(req.query.page);
	var count = parseInt(req.query.count);
	var category = req.query.category;
	var ascending = parseInt(req.query.ascending);
	var query = req.query.query;

	_validateGetAttendeesRequest(page, count, category, ascending)
		.then(function() {
			if(_.isUndefined(query)){
				var message = "Invalid query parameter";
				var source = "query";
				return _Promise.reject(new errors.InvalidParameterError(message, source));
			}
			return _Promise.resolve(true);
		})
		.then(function () {
			return services.RegistrationService.findAttendeesByName(page, count, category, ascending, query);
		})
		.then(function (results) {
			res.body = {};
			res.body.attendees = results;

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

function filterAttendees(req, res, next) {
	_.defaults(req.query, {'page': 1, 'count': 25, 'category': 'firstName', 'ascending': 1});
	var page = parseInt(req.query.page);
	var count = parseInt(req.query.count);
	var category = req.query.category;
	var ascending = parseInt(req.query.ascending);
	var filterCategory = req.query.filterCategory;
	var filterVal = req.query.filterVal;

	_validateGetAttendeesRequest(page, count, category, ascending)
		.then(function () {
			if(_.isUndefined(filterCategory) || !registration.verifyCategory(filterCategory)){
				var message = "Invalid filterCategory parameter";
				var source = "filterCategory";
				return _Promise.reject(new errors.InvalidParameterError(message, source));
			}
			if(_.isUndefined(filterVal)){
				var message = "Invalid filterVal parameter";
				var source = "filterVal";
				return _Promise.reject(new errors.InvalidParameterError(message, source));
			}
			return _Promise.resolve(true);
		})
		.then(function () {
			return services.RegistrationService.filterAttendees(page, count, category, ascending, filterCategory, filterVal);
		})
		.then(function (results) {
			res.body = {};
			res.body.attendees = results;

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

function sendMailinglist(req, res, next) {
	var listName = req.body.listName;
	var mailList = mail.lists.listName;
	var template = req.body.template;

	if(_.isUndefined(mailList)){
		message = "Invalid listName parameter";
		source = "listName";
		return _Promise.reject(new errors.InvalidParameterError(message, source));
	}

	services.MailService
		.sendToList(mailList, template)
		.then(function () {
			res.body = {};

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

router.use(bodyParser.json());
router.use(middleware.auth);

router.post('/mentor', middleware.request(requests.MentorRequest),
	middleware.permission(roles.NONE, _isAuthenticated), createMentor);
router.get('/mentor', middleware.permission(roles.MENTOR), fetchMentorByUser);
router.get('/mentor/:id', middleware.permission(roles.ORGANIZERS), fetchMentorById);
router.put('/mentor', middleware.request(requests.MentorRequest),
	middleware.permission(roles.MENTOR), updateMentorByUser);
router.put('/mentor/:id', middleware.request(requests.MentorRequest),
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
router.put('/attendee/decision/:id',  middleware.request(requests.AttendeeDecisionRequest),
	middleware.permission(roles.ORGANIZERS), updateAttendeeDecision);
router.put('/attendee/:id(\\d+)', middleware.request(requests.AttendeeRequest),
	middleware.permission(roles.ORGANIZERS), updateAttendeeById);

router.put('/sendlist', middleware.request(requests.SendListRequest), 
	middleware.permission(roles.ORGANIZERS), sendMailinglist);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
