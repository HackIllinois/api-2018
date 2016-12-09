var _Promise = require('bluebird');

var chai = require('chai');
var sinon = require('sinon');

var errors = require('../api/v1/errors');
var utils = require('../api/v1/utils');
var StorageService = require('../api/v1/services/StorageService.js');
var Upload = require('../api/v1/models/Upload.js');
var User = require('../api/v1/models/User.js');
var client = require('aws-sdk');

var assert = chai.assert;
var expect = chai.expect;

describe('StorageService',function(){

    describe('createUpload', function () {
        var _forge;
        var _save;
        var testUser

        before(function (done) {
            testUser = User.forge({ id: 1, email: 'new@example.com' });
            _forge = sinon.spy(Upload,'forge');
            _save = sinon.spy(Upload.prototype, 'save');
            done();
        });
        it('creates a new upload with generated key', function (done) {
            var params = {};
            params.bucket = "target_bucket";
            StorageService.createUpload(testUser, params);
            params.ownerId = 1;
            params.key = sinon.match.string;
            assert(_forge.withArgs(params).calledOnce,"forge not called with right parameters");
            assert(_save.calledOnce,"save not called");
            done();
        });
        it('creates a new upload with defined key', function (done) {
            var params = {};
            params.bucket = "target_bucket";
            params.key = "key";
            StorageService.createUpload(testUser, params);
            params.ownerId = 1;
            assert(_forge.withArgs(params).called,"forge not called with right parameters");
            assert(_save.called,"save not called");
            done();
        });
        after(function(done) {
            _forge.restore();
            _save.restore();
            done();
        });
    });
});