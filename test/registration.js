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

    describe('createAttendee', function () {
        var testUser;
        var testRegistration;
        var _forgeAttendee;
        var _saveAttendee;
        var _createAttendeeEcosystemInterest;
        var _createAttendeeExtraInfo;
        var _createAttendeeProject;
        var _createAttendeeRequestedCollaborator;

        before(function(done){
            testUser = User.forge({ id: 1, email: 'new@example.com' });
            testRegistration = {};
            testRegistration.attendee = {
                "firstName": "John",
                "lastName": "Doe",
                "shirtSize": "M",
                "diet":	"NONE",
                "age":	19,
                "transportation":	"NOT_NEEDED",
                "school":	"University of Illinois at Urbana-Champaign",
                "major":	"Computer Science",
                "gender":	"MALE",
                "professionalInterest":	"BOTH",
                "github": "JDoe1234",
                "interests": "CS",
                "isNovice":	true,
                "isPrivate": false
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
            _createAttendeeEcosystemInterest = sinon.spy(AttendeeEcosystemInterest.prototype, 'save');
            _createAttendeeExtraInfo = sinon.spy(AttendeeExtraInfo.prototype, 'save');
            _createAttendeeProject = sinon.spy(AttendeeProject.prototype, 'save');
            _createAttendeeRequestedCollaborator = sinon.spy(AttendeeRequestedCollaborator.prototype, 'save');

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
                assert(_createAttendeeProject.calledOnce, "AttendeeProject save not called");
                assert(_createAttendeeExtraInfo.calledOnce, "AttendeeExtraInfo save not called");
                assert(_createAttendeeEcosystemInterest.calledOnce, "AttendeeEcosystemInterest save not called");
                assert(_createAttendeeRequestedCollaborator.calledOnce, "AttendeeRequestedCollaborator save not called");
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
			_createAttendeeProject.restore();
			_createAttendeeExtraInfo.restore();
			_createAttendeeEcosystemInterest.restore();
			_createAttendeeRequestedCollaborator.restore();
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
        var _saveAttendee;
        var _createAttendeeEcosystemInterest;
        var _createAttendeeExtraInfo;
        var _createAttendeeProject;
        var _createAttendeeRequestedCollaborator;

        before(function(done){
            testRegistration = {};
            testRegistration.attendee = {
                "id": 1,
                "firstName": "John",
                "lastName": "Doe",
                "shirtSize": "M",
                "diet":	"NONE",
                "age":	19,
                "transportation":	"NOT_NEEDED",
                "school":	"University of Illinois at Urbana-Champaign",
                "major":	"Computer Science",
                "gender":	"MALE",
                "professionalInterest":	"BOTH",
                "github": "JDoe1234",
                "interests": "CS",
                "isNovice":	true,
                "isPrivate": false,
                "userId": 1
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
            _createAttendeeEcosystemInterest = sinon.spy(AttendeeEcosystemInterest.prototype, 'save');
            _createAttendeeExtraInfo = sinon.spy(AttendeeExtraInfo.prototype, 'save');
            _createAttendeeProject = sinon.spy(AttendeeProject.prototype, 'save');
            _createAttendeeRequestedCollaborator = sinon.spy(AttendeeRequestedCollaborator.prototype, 'save');

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
                assert(_createAttendeeProject.calledOnce, "AttendeeProject save not called");
                assert(_createAttendeeExtraInfo.calledOnce, "AttendeeExtraInfo save not called");
                assert(_createAttendeeEcosystemInterest.calledOnce, "AttendeeEcosystemInterest save not called");
                assert(!_createAttendeeRequestedCollaborator.called, "AttendeeRequestedCollaborator save called when not updated");
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
			_createAttendeeProject.restore();
			_createAttendeeExtraInfo.restore();
			_createAttendeeEcosystemInterest.restore();
			_createAttendeeRequestedCollaborator.restore();
			done();
		});
    });

});
