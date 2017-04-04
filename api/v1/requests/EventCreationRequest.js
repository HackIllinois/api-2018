var Request = require('./Request');
var validators = require('../utils/validators');
var time = require('../utils/time');

var eventLocationValidations = {
    locationId:  ['required', 'integer']
};

var bodyRequired = ['event', 'eventLocations'];
var bodyValidations = {
    'event': ['required', 'plainObject'],
    'event.name': ['required', 'string', 'maxLength:255'],
    'event.shortName': ['required', 'string', 'maxLength:25'],
    'event.description': ['required', 'string', 'maxLength:2047'],
    'event.tracking': ['required', 'boolean'],
    'event.startTime': ['required', time.verifyDate],
    'event.endTime': ['required', time.verifyDate],
    'eventLocations': ['array', validators.array(validators.nested(eventLocationValidations, 'eventLocations'), 'eventLocations')]
};

function EventCreationRequest(headers, body) {
    Request.call(this, headers, body);

    this.bodyRequired = bodyRequired;
    this.bodyValidations = bodyValidations;
}

EventCreationRequest._eventLocationValidations = eventLocationValidations;

EventCreationRequest.prototype = Object.create(Request.prototype);
EventCreationRequest.prototype.constructor = EventCreationRequest;

module.exports = EventCreationRequest;
