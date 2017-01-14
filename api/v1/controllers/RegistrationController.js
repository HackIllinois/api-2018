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

function _validateGetAllRequest(page, count, category, ascending){
	if(_.isNaN(page)){
		var message = "Invalid page parameter";
		var source = "page";
		return _Promise.reject(new errors.InvalidParameterError(message, source));
	}
	if(_.isNaN(count)){
		var message = "Invalid count parameter";
		var source = "count";
		return _Promise.reject(new errors.InvalidParameterError(message, source));
	}
	if(_.isNaN(ascending) || (ascending != 0 && ascending != 1)){
		var message = "Invalid ascending parameter";
		var source = "ascending";
		return _Promise.reject(new errors.InvalidParameterError(message, source));
	}
	if(_.isNaN(category) || !registration.verifyCategory(category)){
		var message = "Invalid category parameter";
		var source = "category";
		return _Promise.reject(new errors.InvalidParameterError(message, source));
	}
	return _Promise.resolve(true);
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
	delete req.body.status;

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
	if (!req.user.hasRoles(roles.ORGANIZERS)) {
		delete req.body.status;
	}

	services.RegistrationService
		.findAttendeeByUser(req.user)
		.then(function (attendee) {
			return services.RegistrationService.updateAttendee(attendee, req.body);
		})
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

function updateAttendeeById(req, res, next) {
	delete req.body.attendee.id;
	if (!req.user.hasRoles(roles.ORGANIZERS)) {
		delete req.body.status;
	}

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

function getAttendeeBatch(req, res, next) {
	_.defaults(req.query, {'page': 1, 'count': 25, 'category': 'firstName', 'ascending': 1});
	var page = parseInt(req.query.page);
	var count = parseInt(req.query.count);
	var category = req.query.category;
	var ascending = parseInt(req.query.ascending);

	_validateGetAllRequest(page, count, category, ascending)
		.then(function () {
			return services.RegistrationService.fetchAllAttendees(page, count, category, ascending)
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

function getAttendeeBatchWithFilter(req, res, next) {
	_.defaults(req.query, {'page': 1, 'count': 25, 'category': 'firstName', 'ascending': 1});
	var page = parseInt(req.query.page);
	var count = parseInt(req.query.count);
	var category = req.query.category;
	var ascending = parseInt(req.query.ascending);
	var query = req.query.query;

	_validateGetAllRequest(page, count, category, ascending)
		.then(function () {
			return services.RegistrationService.findSomeAttendees(page, count, category, ascending, query)
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
router.get('/attendee/:id', middleware.permission(roles.ORGANIZERS), fetchAttendeeById);
router.put('/attendee', middleware.request(requests.AttendeeRequest),
	middleware.permission(roles.ATTENDEE), updateAttendeeByUser);
router.put('/attendee/:id', middleware.request(requests.AttendeeRequest),
	middleware.permission(roles.ORGANIZERS), updateAttendeeById);
router.get('/allAttendees', middleware.permission(roles.ORGANIZERS), getAttendeeBatch);
router.get('/searchAttendees', middleware.permission(roles.ORGANIZERS), getAttendeeBatchWithFilter);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
