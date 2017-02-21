var _Promise = require('bluebird');

var chai = require('chai');
var sinon = require('sinon');

var errors = require('../api/v1/errors');
var utils = require('../api/v1/utils');
var CheckInService = require('../api/v1/services/CheckInService.js');
var CheckIn = require('../api/v1/models/CheckIn.js');
var NetworkCredential = require('../api/v1/models/NetworkCredential.js');
var UserService = require('../api/v1/services/UserService');
var User = require('../api/v1/models/User')

var expect = chai.expect;

describe("CheckInService", function () {
    describe("findCheckInByUserId", function () {

        var _findByUserId;

        before(function (done) {
            var testCheckIn = CheckIn.forge({ id: 1, user_id: 2342, location: "ECEB"})

            _findByUserId = sinon.stub(CheckIn, 'findByUserId');

            _findByUserId.withArgs(2342).returns(_Promise.resolve(testCheckIn));
            _findByUserId.withArgs(3232).returns(_Promise.resolve(null));

            done();
        });

        it('finds a CheckIn using valid user id', function (done) {
            var checkin = CheckInService.findCheckInByUserId(2342);
            expect(checkin).to.eventually.have.deep.property("checkin.attributes.id", 1).and.notify(done);
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

        var testCheckIn;
        var testAttendeeCheckIn;
        var _save;
        var _findByUserId;
        var _get;

        before(function (done) {
            testCheckIn = {
                "userId": 2342,
                "location": "DCL",
                "swag": false
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
        var _findByUserId;
        var _findUserById;
        var _findUnassigned;
        var _save;
        var _saveCreds;

        before(function(done) {
            testCheckIn = {
                "userId": 3232,
                "swag": true,
                "location": "DCL",
                "credentialsRequested": true
            }

            var unassignedNetworkCredential = NetworkCredential.forge({
                "userId": null,
                "account": "ACCOUNT",
                "password": "PASSWORD",
                "assigned": false
            });

            var existingCheckIn = CheckIn.forge({ id: 1,  user_id: 2342, location: "ECEB"})

            _findByUserId = sinon.stub(CheckIn, 'findByUserId');
            _findByUserId.withArgs(2342).returns(_Promise.resolve(existingCheckIn));
            _findByUserId.withArgs(3232).returns(_Promise.resolve(null));

            _findUserById = sinon.stub(UserService, 'findUserById');
            _findUserById.withArgs(3232).returns(_Promise.resolve(User.forge({id: 1})));

            _findUnassigned = sinon.stub(NetworkCredential, 'findUnassigned');
            _findUnassigned.returns(_Promise.resolve(unassignedNetworkCredential));

            _save = sinon.stub(CheckIn.prototype, 'save', function() {
                return _Promise.resolve(this);
            });

            _saveCreds = sinon.stub(NetworkCredential.prototype, 'save', function() {
                return _Promise.resolve(this);
            });

            done();
        });
        it("creates a valid CheckIn", function(done) {
            var newCheckIn = CheckInService.createCheckIn(testCheckIn);
            expect(newCheckIn).to.eventually.have.deep.property("checkin.attributes.swag", true)
            .then(function() {
                expect(newCheckIn).to.eventually.have.deep.property("credentials.attributes.assigned", true)
                .then(function(){
                    expect(newCheckIn).to.eventually.have.deep.property("credentials.attributes.userId", 3232).and.notify(done);
                })
            });
        });
        it("fails when user already has CheckIn", function(done) {
            testCheckIn.userId = 2342;
            var newCheckIn = CheckInService.createCheckIn(testCheckIn);
            expect(newCheckIn).to.eventually.be.rejectedWith(errors.InvalidParameterError).and.notify(done);
        });
        after(function(done) {
            _save.restore();
            _findUserById.restore();
            _findByUserId.restore();
            done();
        })
    });

});
