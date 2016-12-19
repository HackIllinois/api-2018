var _Promise = require('bluebird');

var chai = require('chai');
var sinon = require('sinon');

var errors = require('../api/v1/errors');
var utils = require('../api/v1/utils');
var StorageService = require('../api/v1/services/StorageService.js');
var Upload = require('../api/v1/models/Upload.js');
var User = require('../api/v1/models/User.js');

var assert = chai.assert;
var expect = chai.expect;
var tracker = require('mock-knex').getTracker();

function _patchInsertUpdate () {
	// adds a query handler to the mock database connection so that
	// it returns a result (i.e. on save for these tests)
	tracker.on('query', function (query) {
		query.response([]);
	});
}

describe('StorageService',function(){

	describe('createUpload', function () {
		var _forge;
		var _save;
		var testUser;

		before(function (done) {
			testUser = User.forge({ id: 1, email: 'new@example.com' });
			_forge = sinon.spy(Upload,'forge');
			_save = sinon.spy(Upload.prototype, 'save');
			done();
		});
		beforeEach(function (done) {
			tracker.install();
			done();
		});

		it('creates a new upload with generated key', function (done) {
			var params = {};
			params.bucket = "target_bucket";

			_patchInsertUpdate();
			var upload = StorageService.createUpload(testUser, params);

			// define the expected parameters
			params.ownerId = 1;
			params.key = sinon.match.string;

			upload.then(function () {
				assert(_forge.withArgs(params).calledOnce, "forge not called with right parameters");
				assert(_save.calledOnce, "save not called");
				return done();
			}).catch(function (err) {
				return done(err);
			});
		});
		it('creates a new upload with defined key', function (done) {
			var params = {};
			params.bucket = "target_bucket";
			params.key = "key";
			params.ownerId = 1;

			_patchInsertUpdate();
			var upload = StorageService.createUpload(testUser, params);

			upload.then(function () {
				assert(_forge.withArgs(params).called, "forge not called with right parameters");
				assert(_save.called, "save not called");
				return done();
			}).catch(function (e) {
				return done(e);
			});
		});

		afterEach(function (done) {
			tracker.uninstall();
			done();
		});
		after(function(done) {
			_forge.restore();
			_save.restore();
			done();
		});
	});
});
