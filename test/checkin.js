var _Promise = require('bluebird');

var chai = require('chai');
var sinon = require('sinon');

var errors = require('../api/v1/errors');
var utils = require('../api/v1/utils');
var CheckInService = require('../api/v1/services/CheckInService.js');
var CheckIn = require('../api/v1/models/CheckIn.js');

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

        before(function (done) {
            testCheckIn1 = {
                "checkedIn": false,
                "userId": 2342,
                "location": "NONE"
            };

            testAttendeeCheckIn1 = CheckIn.forge(testCheckIn1);

            testCheckIn2 = {
                "checkedIn": true,
                "userId": 4342,
                "location": "NONE"
            };

            testAttendeeCheckIn2 = CheckIn.forge(testCheckIn2);

            testCheckIn1.checked_in = true;
            testCheckIn1.location = "SIEBEL";
            testCheckIn1.swag = true;

            done();
        });

        it('updates status of checked_in from false to true', function (done){

            tracker.on('query', function (query) {
                query.response([1]);
            });

            var updatedCheckIn = CheckInService.updateCheckIn(testAttendeeCheckIn1, testCheckIn1);
            assert(updatedCheckIn.get('checkedIn'), "Checked in wasn't updated properly");

            done();
        });

        it('throws error for requesting to check in if user is already checked in', function (done){

            var errorAttributes = {
                "checkedIn": true
            };

            var updatedCheckIn = CheckInService.updateCheckIn(testAttendeeCheckIn2, errorAttributes);
            expect(updatedCheckIn).to.eventually.be.rejectedWith(errors.UnauthorizedError).and.notify(done);
        });

    });

});