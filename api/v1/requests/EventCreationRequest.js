var Request = require('./Request');
var validators = require('../utils/validators');
var time = require('../utils/time');
var events = require('../utils/events');

var eventLocationValidations = {
    locationId:  ['required', 'integer']
};

var bodyRequired = ['event'];
var bodyAllowed = ['eventLocations'];
var bodyValidations = {
    'event': ['required', 'plainObject'],
    'event.name': ['required', 'string', 'maxLength:255'],
    'event.description': ['required', 'string', 'maxLength:2047'],
    'event.startTime': ['required', time.verifyDate],
    'event.endTime': ['required', time.verifyDate],
    'event.tag': ['required', 'string', events.verifyTag],
    'eventLocations': ['array', validators.array(validators.nested(eventLocationValidations, 'eventLocations'))]
};

function EventCreationRequest(headers, body) {
    Request.call(this, headers, body);

    this.bodyRequired = bodyRequired;
    this.bodyAllowed = bodyAllowed;
    this.bodyValidations = bodyValidations;
}

EventCreationRequest._eventLocationValidations = eventLocationValidations;

EventCreationRequest.prototype = Object.create(Request.prototype);
EventCreationRequest.prototype.constructor = EventCreationRequest;

module.exports = EventCreationRequest;
