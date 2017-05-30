var _Promise = require('bluebird');

var chai = require('chai');
var sinon = require('sinon');
var _ = require('lodash');

var errors = require('../api/v1/errors');
var utils = require('../api/v1/utils');
var CheckInService = require('../api/v1/services/CheckInService.js');
var CheckIn = require('../api/v1/models/CheckIn.js');
var NetworkCredential = require('../api/v1/models/NetworkCredential.js');
var UserService = require('../api/v1/services/UserService');
var User = require('../api/v1/models/User')

var assert = chai.assert;
var expect = chai.expect;
var tracker = require('mock-knex').getTracker();


describe("CheckInService", function () {
    describe("findCheckInByUserId", function () {

        var testUser;
        var noCheckinTestUser;
        var testCheckIn;
        var _findByUserId;

        before(function (done) {
            testUser = User.forge({id: 1, email: 'test@exmple.com' });
            testUser.related('roles').add({ role: utils.roles.ATTENDEE });

            noCheckinTestUser = User.forge({id: 2, email: 'nullTest@exmple.com' });
            noCheckinTestUser.related('roles').add({ role: utils.roles.ATTENDEE });

            testCheckIn = CheckIn.forge({ id: 1, user_id: testUser.id, location: "ECEB", swag: false});

            _findByUserId = sinon.spy(CheckIn, 'findByUserId');

            tracker.install();

            tracker.on('query', function(query) {
                if (query.bindings[0] == testUser.id) {
                    query.response([testCheckIn]);
                } else {
                    query.response([]);
                }
            });

            done();
        });

        it('finds a CheckIn using valid user id', function (done) {
            var checkin = CheckInService.findCheckInByUserId(testUser.id);
            checkin.then(function(response) {
                expect(response).to.have.deep.property("checkin.attributes.id", testCheckIn.id);
                assert(_findByUserId.calledOnce, "CheckIn findByUserId not called once");
                done();
            });
        });

        it('throws error for requesting a CheckIn for non-existent user', function (done) {
            var checkin = CheckInService.findCheckInByUserId(noCheckinTestUser.id);
            checkin.catch(function(error) {
                    expect(error).to.be.an.instanceof(errors.NotFoundError);
                    assert(_findByUserId.calledOnce, "CheckIn findByUserId not called once");
                    done();
            });
        });

        afterEach(function(done) {
            _findByUserId.reset();
            done();
        });

        after(function (done) {
            tracker.uninstall();
            _findByUserId.restore();
            done();
        });
    });

    describe("updateCheckIn", function () {

        var testCheckIn;
        var testAttendeeCheckIn;
        var _save;
        var _findByUserId;
        var _get;

        before(function (done) {
            testCheckIn = {
                "userId": 2342,
                "location": "DCL",
                "swag": true,
                "credentialsRequested": false
            };

            _findByUserId = sinon.stub(CheckIn, 'findByUserId');

            _get = sinon.stub(CheckIn.prototype, 'get');
            _get.withArgs("userId").returns(testCheckIn["userId"]);
            _get.withArgs("location").returns(testCheckIn["location"]);
            _get.withArgs("swag").returns(testCheckIn["swag"]);
            _save = sinon.stub(CheckIn.prototype, 'save', function() {
                return _Promise.resolve(this);
            });

            done();
        });

        it('updates status of CheckIn variables when changing swag from false to true', function (done){
            testAttendeeCheckIn = CheckIn.forge(testCheckIn);
            _findByUserId.withArgs(2342).returns(_Promise.resolve(testAttendeeCheckIn));
            testCheckIn.location = "SIEBEL";
            testCheckIn.swag = true;

            CheckInService.updateCheckIn(testCheckIn)
                .then(function(checkin) {
                    expect(checkin).to.have.deep.property("checkin.attributes.location", "SIEBEL");
                    expect(checkin).to.have.deep.property("checkin.attributes.swag", true);
                    done();
                })
        });
        it('cannot change swag from true to false', function (done){
            testAttendeeCheckIn = CheckIn.forge(testCheckIn);
            _get.withArgs("swag").returns(testCheckIn["swag"]);
            _findByUserId.withArgs(2342).returns(_Promise.resolve(testAttendeeCheckIn));
            testCheckIn.userId = 2342;
            testCheckIn.swag = false;

            CheckInService.updateCheckIn(testCheckIn)
                .then(function(checkin) {
                    expect(checkin).to.have.deep.property("checkin.attributes.location", "SIEBEL");
                    expect(checkin).to.have.deep.property("checkin.attributes.swag", true);
                    done();
                })
        });
        after(function(done) {
            _get.restore();
            _findByUserId.restore();
            _save.restore();
            done();
        });
    });

    describe("createCheckIn", function() {

        var testCheckIn;
        var _saveCheckin;

        before(function(done) {
            testCheckIn = {
                "userId": 1,
                "location": "DCL",
                "swag": false,
                "credentialsRequested": false
            };

            _saveCheckin = sinon.spy(CheckIn.prototype, 'save');

            done();
        });
    		beforeEach(function (done) {
    				tracker.install();
    				done();
    		});
        it("creates a valid CheckIn", function(done) {
          var testCheckInClone = _.clone(testCheckIn);
          tracker.on('query', function (query) {
    					query.response([]);
    			});

    			var checkin = CheckInService.createCheckIn(testCheckInClone);

    			checkin.bind(this).then(function() {
    					assert(_saveCheckin.calledOnce, "Checkin forge not called");
    					done();
    			})
          .catch(function (err) {
    					done(err);
    			});
        });
        it("fails when user already has CheckIn", function(done) {
          var testCheckInClone = _.clone(testCheckIn);

    			tracker.on('query', function (query) {
    					query.reject(new errors.InvalidParameterError);
    			});

    			var checkin = CheckInService.createCheckIn(testCheckInClone);
    			expect(checkin).to.eventually.be.rejectedWith(errors.InvalidParameterError).and.notify(done);
        });
    		afterEach(function (done) {
    				tracker.uninstall();
    				done();
    		});
        after(function(done) {
            _saveCheckin.restore();
            done();
        })
    });

});
