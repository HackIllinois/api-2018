const _Promise = require('bluebird');

const chai = require('chai');
const sinon = require('sinon');
const _ = require('lodash');

const errors = require('../api/v1/errors');
const utils = require('../api/v1/utils');
const User = require('../api/v1/models/User.js');
const Attendee = require('../api/v1/models/Attendee.js');
const AttendeeRSVP = require('../api/v1/models/AttendeeRSVP.js');
const RSVPService = require('../api/v1/services/RSVPService.js');
const UserRole = require('../api/v1/models/UserRole.js');

const assert = chai.assert;
const expect = chai.expect;
const tracker = require('mock-knex').getTracker();

describe('RSVPService', () => {
  let _saveRSVP;

  describe('createRSVP', () => {
    let testUser;
    let testAttendee;
    let testRSVP;
    let _forgeRSVP;

    before((done) => {
      testUser = User.forge({ id: 1, email: 'new@example.com' });
      testUser.related('roles').add({ role: utils.roles.ATTENDEE });

      testAttendee = Attendee.forge({
        'id': 1,
        'userId': 1,
        'firstName': 'John',
        'lastName': 'Doe'
      });

      testRSVP = {
        'id': 1,
        'attendeeId': 1,
        'isAttending': true,
        'type': 'CREATE'
      };

      _forgeRSVP = sinon.spy(AttendeeRSVP, 'forge');
      _saveRSVP = sinon.spy(AttendeeRSVP.prototype, 'save');

      done();
    });
    beforeEach((done) => {
      tracker.install();
      done();
    });
    it('creates a rsvp for a valid attendee and sets its attendee role', function(done){
      const testRSVPClone = _.clone(testRSVP);

      tracker.on('query', (query) => {
        query.response([]);
      });

      const RSVP = RSVPService.createRSVP(testAttendee, testUser, testRSVPClone);
      RSVP.bind(this).then(() => {
        const _userRole = testUser.getRole(utils.roles.ATTENDEE);

        assert(_forgeRSVP.called, 'RSVP forge not called with right parameters');
        assert(_saveRSVP.calledOnce, 'RSVP save not called');
        assert(_userRole.get('active'), 'Attendee role not set to active');
        return done();
      }).catch((err) => done(err));
    });
    it('throws an error for an RSVP in which the type is not present when expected', (done) => {
      const testRSVPClone = _.clone(testRSVP);
      delete testRSVPClone.type;

      const RSVP = RSVPService.createRSVP(testAttendee, testUser, testRSVPClone);
      expect(RSVP).to.eventually.be.rejectedWith(errors.InvalidParameterError).and.notify(done);
    });
    afterEach((done) => {
      tracker.uninstall();
      done();
    });
    after((done) => {
      _forgeRSVP.restore();
      _saveRSVP.restore();
      done();
    });
  });

  describe('findRSVPByAttendee', () => {
    let _findByAttendeeId;
    let testAttendee;
    let nonExistentTestAttendee;

    before((done) => {
      testAttendee = Attendee.forge({id: 1, firstName: 'Example', lastName: 'User'});
      nonExistentTestAttendee = Attendee.forge({id: 2, firstName: 'Example', lastName: 'User'});
      const testRSVP = AttendeeRSVP.forge({
        'id': 100,
        'attendeeId': 1,
        'isAttending': true,
        'type': 'CREATE'
      });

      _findByAttendeeId = sinon.stub(AttendeeRSVP, 'findByAttendeeId');

      _findByAttendeeId.withArgs(testAttendee.get('id')).returns(_Promise.resolve(testRSVP));
      _findByAttendeeId.withArgs(sinon.match.number).returns(_Promise.resolve(null));
      done();
    });
    it('finds existing rsvp', (done) => {
      const RSVP = RSVPService.findRSVPByAttendee(testAttendee);
      expect(RSVP).to.eventually.have.deep.property('attributes.id', 100, 'ID should be 100, the searched for ID')
                .then(() => {
                  expect(RSVP).to.eventually.have.deep.property('attributes.isAttending',
                        true, 'isAttending should be true').notify(done);
                });
    });
    it('throws exception after searching for non-existent attendee', (done) => {
      const RSVP = RSVPService.findRSVPByAttendee(nonExistentTestAttendee);
      expect(RSVP).to.eventually.be.rejectedWith(errors.NotFoundError).and.notify(done);
    });
    after((done) => {
      _findByAttendeeId.restore();
      done();
    });
  });

  describe('updateRSVP', () => {
    let testRSVP;
    let testAttendeeRSVP;
    let testUser;
    let _setRSVP;
    let _attendeeRole;

    before((done) => {
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
    beforeEach((done) => {
      tracker.install();
      done();
    });
    it('updates an RSVP', function(done){
      const testRSVPClone = _.clone(testRSVP);

      tracker.on('query', (query) => {
        query.response([ 0 ]);
      });

      const RSVP = RSVPService.updateRSVP(testUser, testAttendeeRSVP, testRSVPClone);
      RSVP.bind(this).then(function() {
        assert(_setRSVP.calledThrice, 'RSVP update not called with right parameters');
        assert(_saveRSVP.calledOnce, 'RSVP save not called');

        _attendeeRole = testUser.getRole(utils.roles.ATTENDEE);
        assert(!_attendeeRole.get('active'), 'Role is not unset when attendance is revoked');
        assert(!this.type, 'Type is not removed when attendance is revoked');

        return done();
      }).catch((err) => done(err));
    });
    afterEach((done) => {
      tracker.uninstall();
      done();
    });
    after((done) => {
      _setRSVP.restore();
      _saveRSVP.restore();
      done();
    });
  });
});
