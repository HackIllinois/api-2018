var _Promise = require('bluebird');

var chai = require('chai');
var sinon = require('sinon');

var errors = require('../api/v1/errors');
var utils = require('../api/v1/utils');
var CheckInService = require('../api/v1/services/CheckInService.js');
var CheckIn = require('../api/v1/models/CheckIn.js');
var UserService = require('../api/v1/services/UserService');
var User = require('../api/v1/models/User')

var assert = chai.assert;
var expect = chai.expect;
var tracker = require('mock-knex').getTracker();

describe("CheckInService", function () {
    describe("findCheckInByUserId", function () {

        var _findByUserId

        before(function (done) {
            var testCheckIn = CheckIn.forge({ id: 1, checked_in: false, user_id: 2342, location: "ECEB"})

            _findByUserId = sinon.stub(CheckIn, 'findByUserId');

            _findByUserId.withArgs(2342).returns(_Promise.resolve(testCheckIn));
            _findByUserId.withArgs(3232).returns(_Promise.resolve(null));

            done();
        });

        it('finds a CheckIn using valid user id', function (done) {
            var checkin = CheckInService.findCheckInByUserId(2342);
            expect(checkin).to.eventually.have.deep.property("attributes.id", 1).and.notify(done);
        });

        it('throws error for requesting a CheckIn for non-existent user', function (done) {
            var checkin = CheckInService.findCheckInByUserId(3232);
            expect(checkin).to.eventually.be.rejectedWith(errors.NotFoundError).and.notify(done);
        });

        after(function (done) {
            _findByUserId.restore();
            done();
        });
    });

    describe("updateCheckIn", function () {

        var testCheckIn1;
        var testCheckIn2;
        var testAttendeeCheckIn1;
        var testAttendeeCheckIn2;
        var _save;

        before(function (done) {
            testCheckIn1 = {
                "checkedIn": false,
                "userId": 2342,
                "location": "DCL",
                "swag": false
            };
            testAttendeeCheckIn1 = CheckIn.forge(testCheckIn1);

            testCheckIn2 = {
                "checkedIn": true,
                "userId": 4342,
                "location": "DCL",
                "swag": false
            };
            testAttendeeCheckIn2 = CheckIn.forge(testCheckIn2);

            _save = sinon.stub(CheckIn.prototype, 'save', function() {
                return this;
            });

            done();
        });

        it('updates status of CheckIn variables', function (done){
            testCheckIn1.checkedIn = true;
            testCheckIn1.location = "SIEBEL";
            testCheckIn1.swag = true;

            var updatedCheckIn = CheckInService.updateCheckIn(testAttendeeCheckIn1, testCheckIn1);
            expect(updatedCheckIn).to.eventually.have.deep.property("attributes.checkedIn", true)
                .then(function (data) {
                    expect(updatedCheckIn).to.eventually.have.deep.property("attributes.location", "SIEBEL")
                        .then(function (data) {
                            expect(updatedCheckIn).to.eventually.have.deep.property("attributes.swag", true)
                                .and.notify(done);
                        });
                });
        });
        it('throws error for requesting to check in if user is already checked in', function (done){
            var errorAttributes = {
                "checkedIn": true
            };
            // var updatedCheckIn = CheckInService.updateCheckIn(testAttendeeCheckIn2, errorAttributes);
            // expect(updatedCheckIn).to.eventually.be.rejectedWith(errors.InvalidParameterError).and.notify(done);
            done();
        });
        after(function(done) {
            _save.restore();
            done();
        });
    });

    describe("createCheckIn", function() {

        var testCheckIn;
        var testAttendeeCheckIn;

        before(function(done) {
            testCheckIn = {
                "checkedIn": true,
                "swag": true
            }

            var existingCheckIn = CheckIn.forge({ id: 1, checked_in: false, user_id: 2342, location: "ECEB"})

            var _findByUserId = sinon.stub(CheckIn, 'findByUserId');
            _findByUserId.withArgs(2342).returns(_Promise.resolve(existingCheckIn));
            _findByUserId.withArgs(3232).returns(_Promise.resolve(null));

            var _findUserById = sinon.stub(UserService, 'findUserById');
            _findUserById.withArgs(3232).returns(_Promise.resolve(User.forge({id: 1})));

            var _save = sinon.stub(CheckIn.prototype, 'save', function() {
                return _Promise.resolve(this);
            });

            done();
        });
        it("creates a valid CheckIn", function(done) {
            var newCheckIn = CheckInService.createCheckIn(3232, testCheckIn);
            expect(newCheckIn).to.eventually.have.deep.property("attributes.checkedIn",true)
                .then(function (data) {
                    expect(newCheckIn).to.eventually.have.deep.property("attributes.swag", true).and.notify(done)
                });
        });
        it("fails when user already has CheckIn", function(done) {
            var newCheckIn = CheckInService.createCheckIn(2342, testCheckIn);
            expect(newCheckIn).to.eventually.be.rejectedWith(errors.InvalidParameterError).and.notify(done);
        });
    });

});