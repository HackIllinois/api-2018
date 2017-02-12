var _Promise = require('bluebird');

var chai = require('chai');
var sinon = require('sinon');

var errors = require('../api/v1/errors');
var utils = require('../api/v1/utils');
var User = require('../api/v1/models/User.js');
var Attendee = require('../api/v1/models/Attendee.js');
var AttendeeEcosystemInterest = require('../api/v1/models/AttendeeEcosystemInterest.js');
var AttendeeExtraInfo = require('../api/v1/models/AttendeeExtraInfo.js');
var AttendeeProject = require('../api/v1/models/AttendeeProject.js');
var AttendeeRequestedCollaborator = require('../api/v1/models/AttendeeRequestedCollaborator.js');
var RegistrationService = require('../api/v1/services/RegistrationService.js');


var assert = chai.assert;
var expect = chai.expect;
var tracker = require('mock-knex').getTracker();

describe('RegistrationService',function(){
    var _saveAttendee;
    var _saveAttendeeEcosystemInterest;
    var _saveAttendeeExtraInfo;
    var _saveAttendeeProject;
    var _saveAttendeeRequestedCollaborator;

    describe('createAttendee', function () {
        var testUser;
        var testRegistration;
        var _forgeAttendee;

        before(function(done){
            testUser = User.forge({ id: 1, email: 'new@example.com' });
            testRegistration = {};
            testRegistration.attendee = {
                "firstName": "John",
                "lastName": "Doe",
                "shirtSize": "M",
                "diet": "NONE",
                "age": 19,
                "graduationYear": 2019,
                "transportation": "NOT_NEEDED",
                "school": "University of Illinois at Urbana-Champaign",
                "major": "Computer Science",
                "gender": "MALE",
                "professionalInterest": "BOTH",
                "github": "JDoe1234",
                "linkedin": "JDoe1234",
                "interests": "CS",
                "finalized": false,
                "isNovice": true,
                "isPrivate": false,
				                    "hasLightningInterest": false,
                "phoneNumber": "12345678910",
                "wave": 0,
                "priority": 0
            };
            testRegistration.projects = [
            	{
            		"name": "Example",
            		"description": "Example project.",
            		"repo": "http://www.github.com/hackillinois/api-2017",
            		"isSuggestion": true
            	}
            ];
            testRegistration.extras = [
            	{
            		"info": "Example extra info"
            	}
            ];
            testRegistration.collaborators = [
            	{
            		"collaborator": "existing@example.com"
            	}
            ];
            testRegistration.ecosystemInterests = [
                {
                    "ecosystemId": 1
                }
            ];
            _forgeAttendee = sinon.spy(Attendee, 'forge');
            _saveAttendee = sinon.spy(Attendee.prototype, 'save');
            _saveAttendeeEcosystemInterest = sinon.spy(AttendeeEcosystemInterest.prototype, 'save');
            _saveAttendeeExtraInfo = sinon.spy(AttendeeExtraInfo.prototype, 'save');
            _saveAttendeeProject = sinon.spy(AttendeeProject.prototype, 'save');
            _saveAttendeeRequestedCollaborator = sinon.spy(AttendeeRequestedCollaborator.prototype, 'save');

            done();
        });
        beforeEach(function (done) {
            tracker.install();
            done();
        });
        it('creates an attendee for a valid user without an attendee role',function(done){
            var testRegistrationClone = JSON.parse(JSON.stringify(testRegistration));
            var attendeeParams = testRegistrationClone.attendee;

            tracker.on('query', function (query) {
                query.response([1]);
            });
            var attendee = RegistrationService.createAttendee(testUser, testRegistrationClone);
            attendee.then(function() {
                attendeeParams.userId = testUser.id;

                assert(_forgeAttendee.withArgs(attendeeParams).calledOnce, "Attendee forge not called with right parameters");
                assert(_saveAttendee.calledOnce, "Attendee save not called");
                assert(_saveAttendeeProject.calledOnce, "AttendeeProject save not called");
                assert(_saveAttendeeExtraInfo.calledOnce, "AttendeeExtraInfo save not called");
                assert(_saveAttendeeEcosystemInterest.calledOnce, "AttendeeEcosystemInterest save not called");
                assert(_saveAttendeeRequestedCollaborator.calledOnce, "AttendeeRequestedCollaborator save not called");
                return done();
            }).catch(function (err) {
				return done(err);
			});
        });
        it('throws an error for a valid user with an attendee role',function(done){
            testUser.related('roles').add({ role: utils.roles.ATTENDEE });
            var testRegistrationClone = JSON.parse(JSON.stringify(testRegistration));

            var attendee = RegistrationService.createAttendee(testUser, testRegistrationClone);
            expect(attendee).to.eventually.be.rejectedWith(errors.InvalidParameterError).and.notify(done);
        });
        afterEach(function (done) {
            tracker.uninstall();
            done();
        });
		after(function(done) {
			_forgeAttendee.restore();
			_saveAttendee.restore();
			_saveAttendeeProject.restore();
			_saveAttendeeExtraInfo.restore();
			_saveAttendeeEcosystemInterest.restore();
			_saveAttendeeRequestedCollaborator.restore();
			done();
		});
    });

    describe('findAttendeeByUser', function () {
        var _findByUserId;
        var testUser;
        var nonExistentUser;

        before(function (done) {
            testUser = User.forge({ id: 1, email: 'new@example.com' });
            nonExistentUser = User.forge({id: 2, email: 'fake@example.com'});
            var testAttendee = Attendee.forge({id: 100, firstName: "Example", lastName: "User"});

			_findByUserId = sinon.stub(Attendee,'findByUserId');

			_findByUserId.withArgs(testUser.get('id')).returns(_Promise.resolve(testAttendee));
			_findByUserId.withArgs(sinon.match.number).returns(_Promise.resolve(null));
			done();
		});
        it('finds existing user',function(done){
            var attendee = RegistrationService.findAttendeeByUser(testUser);
            expect(attendee).to.eventually.have.deep.property("attributes.id", 100, "ID should be 100, the searched for ID")
                .then(function(){
                    expect(attendee).to.eventually.have.deep.property("attributes.firstName",
                        'Example',"first name should be Example").notify(done);
            })
        });
        it('throws exception after searching for non-existent user',function(done){
            var attendee = RegistrationService.findAttendeeByUser(nonExistentUser);
            expect(attendee).to.eventually.be.rejectedWith(errors.NotFoundError).and.notify(done);
        });
        after(function(done){
            _findByUserId.restore();
            done();
        });
    });

    describe('findAttendeeById',function(){
		var _findById;

		before(function(done){
            var testAttendee = Attendee.forge({id: 1, firstName: "Example", lastName: "User"});

			_findById = sinon.stub(Attendee, 'findById');

			_findById.withArgs(1).returns(_Promise.resolve(testAttendee));
			_findById.withArgs(sinon.match.number).returns(_Promise.resolve(null));

			done();
		});
		it('finds existing attendee',function(done){
			var attendee = RegistrationService.findAttendeeById(1);
			expect(attendee).to.eventually.have.deep.property("attributes.id", 1,"ID should be 1, the searched for ID")
				.then(function(){
					expect(attendee).to.eventually.have.deep.property("attributes.firstName",
						'Example',"first name should be Example").notify(done);
			})
		});
		it('throws exception after searching for non-existent attendee',function(done){
			var attendee = RegistrationService.findAttendeeById(2);
			expect(attendee).to.eventually.be.rejectedWith(errors.NotFoundError).and.notify(done);
		});
		after(function(done){
			_findById.restore();
			done();
		});
	});

    describe('updateAttendee', function() {
        var testAttendee;
        var testRegistration;
        var _setAttendee;

        before(function(done){
            testRegistration = {};
            testRegistration.attendee = {
                "id": 1,
                "firstName": "John",
                "lastName": "Doe",
                "shirtSize": "M",
                "diet": "NONE",
                "age": 19,
                "graduationYear": 2019,
                "transportation": "NOT_NEEDED",
                "school": "University of Illinois at Urbana-Champaign",
                "major": "Computer Science",
                "gender": "MALE",
                "professionalInterest": "BOTH",
                "github": "JDoe1234",
                "linkedin": "JDoe1234",
                "interests": "CS",
                "finalized": false,
                "status": "ACCEPTED",
                "isNovice": true,
                "isPrivate": false,
				"hasLightningInterest": false,
                "phoneNumber": "12345678910",
                "userId": 1,
                "priority": 1,
                "wave": 2
            };
            testRegistration.projects = [
            	{
            		"name": "Example",
            		"description": "Example project.",
            		"repo": "http://www.github.com/hackillinois/api-2017",
            		"isSuggestion": true
            	}
            ];
            testRegistration.extras = [
            	{
            		"info": "Example extra info"
            	}
            ];
            testRegistration.ecosystemInterests = [
                {
                    "ecosystemId": 1
                }
            ];
            testAttendee = Attendee.forge(testRegistration.attendee);

            testRegistration.attendee.firstName = "Jane";

            testRegistration.extras[0].info = "New example extra info";
            testRegistration.projects[0].description = "New example project description";
            testRegistration.ecosystemInterests[0].ecosystemId = 2;

            _setAttendee = sinon.spy(Attendee.prototype, 'set');
            _saveAttendee = sinon.spy(Attendee.prototype, 'save');
            _saveAttendeeEcosystemInterest = sinon.spy(AttendeeEcosystemInterest.prototype, 'save');
            _saveAttendeeExtraInfo = sinon.spy(AttendeeExtraInfo.prototype, 'save');
            _saveAttendeeProject = sinon.spy(AttendeeProject.prototype, 'save');
            _saveAttendeeRequestedCollaborator = sinon.spy(AttendeeRequestedCollaborator.prototype, 'save');

            done();
        });
        beforeEach(function (done) {
            tracker.install();
            done();
        });
        it('updates an attendee',function(done){
            var testRegistrationClone = JSON.parse(JSON.stringify(testRegistration));
            var attendeeParams = testRegistrationClone.attendee;

            tracker.on('query', function (query) {
                query.response([1]);
            });
            var attendee = RegistrationService.updateAttendee(testAttendee, testRegistrationClone);
            attendee.then(function() {
                assert(_setAttendee.withArgs(attendeeParams).calledOnce, "Attendee update not called with right parameters");
                assert(_saveAttendee.calledOnce, "Attendee save not called");
                assert(_saveAttendeeProject.calledOnce, "AttendeeProject save not called");
                assert(_saveAttendeeExtraInfo.calledOnce, "AttendeeExtraInfo save not called");
                assert(_saveAttendeeEcosystemInterest.calledOnce, "AttendeeEcosystemInterest save not called");
                assert(!_saveAttendeeRequestedCollaborator.called, "AttendeeRequestedCollaborator save called when not updated");
                return done();
            }).catch(function (err) {
				return done(err);
			});
        });
        afterEach(function (done) {
            tracker.uninstall();
            done();
        });
		after(function(done) {
			_setAttendee.restore();
			_saveAttendee.restore();
			_saveAttendeeProject.restore();
			_saveAttendeeExtraInfo.restore();
			_saveAttendeeEcosystemInterest.restore();
			_saveAttendeeRequestedCollaborator.restore();
			done();
		});
    });

});
