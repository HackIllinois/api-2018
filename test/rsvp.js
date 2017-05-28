var _Promise = require('bluebird');

var chai = require('chai');
var sinon = require('sinon');
var _ = require('lodash');

var errors = require('../api/v1/errors');
var utils = require('../api/v1/utils');
var User = require('../api/v1/models/User.js');
var Attendee = require('../api/v1/models/Attendee.js');
var AttendeeRSVP = require('../api/v1/models/AttendeeRSVP.js');
var RSVPService = require('../api/v1/services/RSVPService.js');
var UserRole = require('../api/v1/models/UserRole.js');

var assert = chai.assert;
var expect = chai.expect;
var tracker = require('mock-knex').getTracker();

describe('RSVPService',function(){
    var _saveRSVP;

    describe('createRSVP', function () {
        var testUser;
        var testAttendee;
        var testRSVP;
        var _forgeRSVP;

        before(function(done){
            testUser = User.forge({ id: 1, email: 'new@example.com' });
            testUser.related('roles').add({ role: utils.roles.ATTENDEE });

            testAttendee = Attendee.forge({
                'id': 1,
                'userId': 1,
                'firstName': 'John',
                'lastName': 'Doe'
            });

            testRSVP =  {
                'id': 1,
                'attendeeId': 1,
                'isAttending': true,
                'type': 'CREATE'
            };

            _forgeRSVP = sinon.spy(AttendeeRSVP, 'forge');
            _saveRSVP = sinon.spy(AttendeeRSVP.prototype, 'save');

            done();
        });
        beforeEach(function (done) {
            tracker.install();
            done();
        });
        it('creates a rsvp for a valid attendee and sets its attendee role',function(done){
            var testRSVPClone = _.clone(testRSVP);

            tracker.on('query', function (query) {
                query.response([]);
            });

            var RSVP = RSVPService.createRSVP(testAttendee, testUser, testRSVPClone);
            RSVP.bind(this).then(function() {
                var _userRole = testUser.getRole(utils.roles.ATTENDEE);

                assert(_forgeRSVP.called, 'RSVP forge not called with right parameters');
                assert(_saveRSVP.calledOnce, 'RSVP save not called');
                assert(_userRole.get('active'), 'Attendee role not set to active');
                return done();
            }).catch(function (err) {
                return done(err);
            });
        });
        it('throws an error for an RSVP in which the type is not present when expected',function(done){
            var testRSVPClone = _.clone(testRSVP);
            delete testRSVPClone.type;

            var RSVP = RSVPService.createRSVP(testAttendee, testUser, testRSVPClone);
            expect(RSVP).to.eventually.be.rejectedWith(errors.InvalidParameterError).and.notify(done);
        });
        afterEach(function (done) {
            tracker.uninstall();
            done();
        });
        after(function(done) {
            _forgeRSVP.restore();
            _saveRSVP.restore();
            done();
        });
    });

    describe('findRSVPByAttendee', function () {
        var _findByAttendeeId;
        var testAttendee;
        var nonExistentTestAttendee;

        before(function (done) {
            testAttendee = Attendee.forge({id: 1, firstName: 'Example', lastName: 'User'});
            nonExistentTestAttendee = Attendee.forge({id: 2, firstName: 'Example', lastName: 'User'});
            var testRSVP  = AttendeeRSVP.forge({
                'id': 100,
                'attendeeId': 1,
                'isAttending': true,
                'type': 'CREATE'
            });

            _findByAttendeeId = sinon.stub(AttendeeRSVP,'findByAttendeeId');

            _findByAttendeeId.withArgs(testAttendee.get('id')).returns(_Promise.resolve(testRSVP));
            _findByAttendeeId.withArgs(sinon.match.number).returns(_Promise.resolve(null));
            done();
        });
        it('finds existing rsvp',function(done){
            var RSVP = RSVPService.findRSVPByAttendee(testAttendee);
            expect(RSVP).to.eventually.have.deep.property('attributes.id', 100, 'ID should be 100, the searched for ID')
                .then(function(){
                    expect(RSVP).to.eventually.have.deep.property('attributes.isAttending',
                        true,'isAttending should be true').notify(done);
                });
        });
        it('throws exception after searching for non-existent attendee',function(done){
            var RSVP = RSVPService.findRSVPByAttendee(nonExistentTestAttendee);
            expect(RSVP).to.eventually.be.rejectedWith(errors.NotFoundError).and.notify(done);
        });
        after(function(done){
            _findByAttendeeId.restore();
            done();
        });
    });

    describe('updateRSVP', function() {
        var testRSVP;
        var testAttendeeRSVP;
        var testUser;
        var _setRSVP;
        var _attendeeRole;

        before(function(done){
            testUser = User.forge({ id: 1, email: 'new@example.com' });
            testUser.related('roles').add({ role: utils.roles.ATTENDEE });
            _attendeeRole = testUser.getRole(utils.roles.ATTENDEE);
            UserRole.setActive(_attendeeRole, true, null);

            testRSVP = {
                'id': 100,
                'attendeeId': 1,
                'isAttending': true,
                'type': 'CREATE'
            };
            testAttendeeRSVP = AttendeeRSVP.forge();

            testRSVP.isAttending = false;
            delete testRSVP.type;

            _setRSVP = sinon.spy(AttendeeRSVP.prototype, 'set');
            _saveRSVP = sinon.spy(AttendeeRSVP.prototype, 'save');

            done();
        });
        beforeEach(function (done) {
            tracker.install();
            done();
        });
        it('updates an RSVP',function(done){
            var testRSVPClone = _.clone(testRSVP);

            tracker.on('query', function (query) {
                query.response([0]);
            });

            var RSVP = RSVPService.updateRSVP(testUser, testAttendeeRSVP, testRSVPClone);
            RSVP.bind(this).then(function() {
                assert(_setRSVP.calledOnce, 'RSVP update not called with right parameters');
                assert(_saveRSVP.calledOnce, 'RSVP save not called');

                _attendeeRole = testUser.getRole(utils.roles.ATTENDEE);
                assert(!_attendeeRole.get('active'), 'Role is not unset when attendance is revoked');
                assert(!this.type, 'Type is not removed when attendance is revoked');

                return done();
            }).catch(function (err) {
                return done(err);
            });

            done();
        });
        afterEach(function (done) {
            tracker.uninstall();
            done();
        });
        after(function(done) {
            _setRSVP.restore();
            _saveRSVP.restore();
            done();
        });
    });
});
