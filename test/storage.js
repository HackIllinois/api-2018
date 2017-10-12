const chai = require('chai');
const sinon = require('sinon');

const StorageService = require('../api/v1/services').StorageService;
const Upload = require('../api/v1/models/Upload.js');
const User = require('../api/v1/models/User.js');

const assert = chai.assert;
const tracker = require('mock-knex').getTracker();

function _patchInsertUpdate () {
	// adds a query handler to the mock database connection so that
	// it returns a result (i.e. on save for these tests)
  tracker.on('query', (query) => {
    query.response([]);
  });
}

describe('StorageService', () => {

  describe('createUpload', () => {
    let _forge;
    let _save;
    let testUser;

    before((done) => {
      testUser = User.forge({ id: 1, email: 'new@example.com' });
      _forge = sinon.spy(Upload, 'forge');
      _save = sinon.spy(Upload.prototype, 'save');
      done();
    });
    beforeEach((done) => {
      tracker.install();
      done();
    });

    it('creates a new upload with generated key', (done) => {
      const params = {};
      params.bucket = 'target_bucket';

      _patchInsertUpdate();
      const upload = StorageService.createUpload(testUser, params);

			// define the expected parameters
      params.ownerId = 1;
      params.key = sinon.match.string;

      upload.then(() => {
        assert(_forge.withArgs(params).calledOnce, 'forge not called with right parameters');
        assert(_save.calledOnce, 'save not called');
        return done();
      }).catch((err) => done(err));
    });
    it('creates a new upload with defined key', (done) => {
      const params = {};
      params.bucket = 'target_bucket';
      params.key = 'key';
      params.ownerId = 1;

      _patchInsertUpdate();
      const upload = StorageService.createUpload(testUser, params);

      upload.then(() => {
        assert(_forge.withArgs(params).called, 'forge not called with right parameters');
        assert(_save.called, 'save not called');
        return done();
      }).catch((e) => done(e));
    });

    afterEach((done) => {
      tracker.uninstall();
      done();
    });
    after((done) => {
      _forge.restore();
      _save.restore();
      done();
    });
  });
});
