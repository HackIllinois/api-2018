const _Promise = require('bluebird');

const chai = require('chai');
const sinon = require('sinon');

const errors = require('../api/v1/errors');
const utils = require('../api/v1/utils');
const User = require('../api/v1/models/User.js');
const Attendee = require('../api/v1/models/Attendee.js');
const AttendeeLongForm = require('../api/v1/models/AttendeeLongForm.js');
const AttendeeRequestedCollaborator = require('../api/v1/models/AttendeeRequestedCollaborator.js');
const RegistrationService = require('../api/v1/services/RegistrationService.js');

const assert = chai.assert;
const expect = chai.expect;
const tracker = require('mock-knex').getTracker();

describe('RegistrationService', () => {
  let _saveAttendee;
  let _saveAttendeeLongForm;
  let _saveAttendeeRequestedCollaborator;

  describe('createAttendee', () => {
    let testUser;
    let testRegistration;
    let _forgeAttendee;

    before((done) => {
      testUser = User.forge({ id: 1, email: 'new@example.com' });
      testRegistration = {};
      testRegistration.attendee = {
        'firstName': 'John',
        'lastName': 'Doe',
        'shirtSize': 'M',
        'diet': 'NONE',
        'age': 19,
        'graduationYear': 2019,
        'transportation': 'NOT_NEEDED',
        'school': 'University of Illinois at Urbana-Champaign',
        'major': 'Computer Science',
        'gender': 'MALE',
        'professionalInterest': 'BOTH',
        'github': 'JDoe1234',
        'linkedin': 'JDoe1234',
        'interests': 'CS',
        'finalized': false,
        'isNovice': true,
        'isPrivate': false,
        'hasLightningInterest': false,
        'phoneNumber': '12345678910',
        'wave': 0,
        'priority': 0
      };
      testRegistration.longForm = [
        {
          'info': 'Example extra info'
        }
      ];
      testRegistration.collaborators = [
        {
          'collaborator': 'existing@example.com'
        }
      ];
      testRegistration.osContributors = [
        {
          'osContributor': 'person'
        }
      ];
      _forgeAttendee = sinon.spy(Attendee, 'forge');
      _saveAttendee = sinon.spy(Attendee.prototype, 'save');
      _saveAttendeeLongForm = sinon.spy(AttendeeLongForm.prototype, 'save');
      _saveAttendeeRequestedCollaborator = sinon.spy(AttendeeRequestedCollaborator.prototype, 'save');

      done();
    });
    beforeEach((done) => {
      tracker.install();
      done();
    });
    it('creates an attendee for a valid user without an attendee role', (done) => {
      const testRegistrationClone = JSON.parse(JSON.stringify(testRegistration));
      const attendeeParams = testRegistrationClone.attendee;

      tracker.on('query', (query) => {
        query.response([ 1 ]);
      });
      const attendee = RegistrationService.createAttendee(testUser, testRegistrationClone);
      attendee.then(() => {
        attendeeParams.userId = testUser.id;

        assert(_forgeAttendee.withArgs(attendeeParams).calledOnce, 'Attendee forge not called with right parameters');
        assert(_saveAttendee.calledOnce, 'Attendee save not called');
        assert(_saveAttendeeLongForm.calledOnce, 'AttendeeLongForm save not called');
        assert(_saveAttendeeRequestedCollaborator.calledOnce, 'AttendeeRequestedCollaborator save not called');
        return done();
      }).catch((err) => done(err));
    });
    it('throws an error for a valid user with an attendee role', (done) => {
      testUser.related('roles').add({ role: utils.roles.ATTENDEE });
      const testRegistrationClone = JSON.parse(JSON.stringify(testRegistration));

      const attendee = RegistrationService.createAttendee(testUser, testRegistrationClone);
      expect(attendee).to.eventually.be.rejectedWith(errors.InvalidParameterError).and.notify(done);
    });
    afterEach((done) => {
      tracker.uninstall();
      done();
    });
    after((done) => {
      _forgeAttendee.restore();
      _saveAttendee.restore();
      _saveAttendeeLongForm.restore();
      _saveAttendeeRequestedCollaborator.restore();
      done();
    });
  });

  describe('findAttendeeByUser', () => {
    let _findByUserId;
    let testUser;
    let nonExistentUser;

    before((done) => {
      testUser = User.forge({ id: 1, email: 'new@example.com' });
      nonExistentUser = User.forge({id: 2, email: 'fake@example.com'});
      const testAttendee = Attendee.forge({id: 100, firstName: 'Example', lastName: 'User'});

      _findByUserId = sinon.stub(Attendee, 'findByUserId');

      _findByUserId.withArgs(testUser.get('id')).returns(_Promise.resolve(testAttendee));
      _findByUserId.withArgs(sinon.match.number).returns(_Promise.resolve(null));
      done();
    });
    it('finds existing user', (done) => {
      const attendee = RegistrationService.findAttendeeByUser(testUser);
      expect(attendee).to.eventually.have.deep.property('attributes.id', 100, 'ID should be 100, the searched for ID')
								.then(() => {
  expect(attendee).to.eventually.have.deep.property('attributes.firstName',
												'Example', 'first name should be Example').notify(done);
});
    });
    it('throws exception after searching for non-existent user', (done) => {
      const attendee = RegistrationService.findAttendeeByUser(nonExistentUser);
      expect(attendee).to.eventually.be.rejectedWith(errors.NotFoundError).and.notify(done);
    });
    after((done) => {
      _findByUserId.restore();
      done();
    });
  });

  describe('findAttendeeById', () => {
    let _findById;

    before((done) => {
      const testAttendee = Attendee.forge({id: 1, firstName: 'Example', lastName: 'User'});

      _findById = sinon.stub(Attendee, 'findById');

      _findById.withArgs(1).returns(_Promise.resolve(testAttendee));
      _findById.withArgs(sinon.match.number).returns(_Promise.resolve(null));

      done();
    });
    it('finds existing attendee', (done) => {
      const attendee = RegistrationService.findAttendeeById(1);
      expect(attendee).to.eventually.have.deep.property('attributes.id', 1, 'ID should be 1, the searched for ID')
				.then(() => {
  expect(attendee).to.eventually.have.deep.property('attributes.firstName',
						'Example', 'first name should be Example').notify(done);
});
    });
    it('throws exception after searching for non-existent attendee', (done) => {
      const attendee = RegistrationService.findAttendeeById(2);
      expect(attendee).to.eventually.be.rejectedWith(errors.NotFoundError).and.notify(done);
    });
    after((done) => {
      _findById.restore();
      done();
    });
  });

  describe('updateAttendee', () => {
    let testAttendee;
    let testRegistration;
    let _setAttendee;

    before((done) => {
      testRegistration = {};
      testRegistration.attendee = {
        'id': 1,
        'firstName': 'John',
        'lastName': 'Doe',
        'shirtSize': 'M',
        'diet': 'NONE',
        'age': 19,
        'graduationYear': 2019,
        'transportation': 'NOT_NEEDED',
        'school': 'University of Illinois at Urbana-Champaign',
        'major': 'Computer Science',
        'gender': 'MALE',
        'professionalInterest': 'BOTH',
        'github': 'JDoe1234',
        'linkedin': 'JDoe1234',
        'interests': 'CS',
        'finalized': false,
        'status': 'ACCEPTED',
        'isNovice': true,
        'isPrivate': false,
        'hasLightningInterest': false,
        'phoneNumber': '12345678910',
        'userId': 1,
        'priority': 1,
        'wave': 2
      };
      testRegistration.longForm = [
        {
          'info': 'Example extra info'
        }
      ];
      testRegistration.osContributors = [
        {
          'osContributor': 'person'
        }
      ];
      testAttendee = Attendee.forge(testRegistration.attendee);

      testRegistration.attendee.firstName = 'Jane';

      testRegistration.longForm[0].info = 'New example extra info';

      _setAttendee = sinon.spy(Attendee.prototype, 'set');
      _saveAttendee = sinon.spy(Attendee.prototype, 'save');
      _saveAttendeeLongForm = sinon.spy(AttendeeLongForm.prototype, 'save');
      _saveAttendeeRequestedCollaborator = sinon.spy(AttendeeRequestedCollaborator.prototype, 'save');

      done();
    });
    beforeEach((done) => {
      tracker.install();
      done();
    });
    it('updates an attendee', (done) => {
      const testRegistrationClone = JSON.parse(JSON.stringify(testRegistration));
      const attendeeParams = testRegistrationClone.attendee;

      tracker.on('query', (query) => {
        query.response([ 1 ]);
      });
      const attendee = RegistrationService.updateAttendee(testAttendee, testRegistrationClone);
      attendee.then(() => {
        assert(_setAttendee.withArgs(attendeeParams).calledOnce, 'Attendee update not called with right parameters');
        assert(_saveAttendee.calledOnce, 'Attendee save not called');
        assert(_saveAttendeeLongForm.calledOnce, 'AttendeeLongForm save not called');
        assert(!_saveAttendeeRequestedCollaborator.called, 'AttendeeRequestedCollaborator save called when not updated');
        return done();
      }).catch((err) => done(err));
    });
    afterEach((done) => {
      tracker.uninstall();
      done();
    });
    after((done) => {
      _setAttendee.restore();
      _saveAttendee.restore();
      _saveAttendeeLongForm.restore();
      _saveAttendeeRequestedCollaborator.restore();
      done();
    });
  });

});
