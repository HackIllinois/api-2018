const chai = require('chai');
const sinon = require('sinon');
const sleep = require('sleep-promise');

const errors = require('../api/v1/errors');
const config = require('../api/config');
const TrackingItem = require('../api/v1/models/TrackingEvent');
const TrackingService = require('../api/v1/services/TrackingService');

const assert = chai.assert;
const expect = chai.expect;
const tracker = require('mock-knex').getTracker();
const fakeredis = require('fakeredis');

const _REDIS_CONFIG = {
  host: config.redis.host,
  port: config.redis.port
};

const _cache = fakeredis.createClient(_REDIS_CONFIG);


describe('TrackingService', () => {
  describe('createTrackingEvent', () => {

    let testTrackingAttributes;
    let testInvalidTrackingAttributes;
    let _save;

    before((done) => {
      testTrackingAttributes = [];

      testTrackingAttributes[0] = {
        id: 0,
        name: 'test_tracking_event',
        duration: 1
      };

      testTrackingAttributes[1] = {
        id: 1,
        name: 'test_tracking_event 2',
        duration: 100
      };

      testInvalidTrackingAttributes = [];

      testInvalidTrackingAttributes[0] = {
        id: 2,
        duration: 'invalid'
      };

      _save = sinon.spy(TrackingItem.prototype, 'save');

      done();
    });

    beforeEach((done) => {
      tracker.install();
      _cache.flushdb('trackedEvent');
      done();
    });

    it('creates a valid tracking event', (done) => {
      tracker.on('query', (query) => {
        query.response(TrackingItem.forge(testTrackingAttributes[0]));
      });

      TrackingService.createTrackingEvent(testTrackingAttributes[0])
          .then((response) => {
            expect(response).to.have.deep.property('id', testTrackingAttributes[0].id);
            expect(response).to.have.deep.property('attributes.name', testTrackingAttributes[0].name);

            assert(_save.calledOnce, 'save not called');

            done();
          });
    });


    it('rejects an event when an active event is already occurring', (done) => {
      tracker.on('query', (query) => {
        const attributes = testTrackingAttributes[query.bindings[1]];
        query.response(TrackingItem.forge(attributes));
      });

      TrackingService.createTrackingEvent(testTrackingAttributes[1])
          .then(() => TrackingService.createTrackingEvent(testTrackingAttributes[0]))
          .then(() => {
            assert.fail('Tracked event was not rejected');
          })
          .catch((error) => {
            expect(error).to.be.an.instanceof(errors.InvalidTrackingStateError);
            done();
          });
    });

    it('rejects an invalid tracking event', (done) => {
      TrackingService.createTrackingEvent(testInvalidTrackingAttributes[0])
          .then(() => {
            assert.fail('Invalid event was not rejected');
          })
          .catch((error) => {
            assert(!_save.called, 'save called');
            expect(error).to.be.an.instanceof(errors.InvalidParameterError);
            done();
          });
    });

    afterEach((done) => {
      _save.reset();
      tracker.uninstall();
      done();
    });

    after((done) => {
      _save.restore();
      done();
    });
  });

  describe('addEventParticipant', () => {

    let testId;
    let eventAttributes;

    before((done) => {
      testId = 1;

      eventAttributes = {
        id: 1,
        name: 'test_tracking_event',
        duration: 10000
      };

      done();
    });

    beforeEach((done) => {
      tracker.install();
      _cache.flushdb('trackedEvent');
      sleep(1000)
          .then(() => {
            done();
          });
    });

    it('fails when no event is currently being tracked', (done) => {
      TrackingService.addEventParticipant(testId)
          .then(() => {
            assert.fail('Invalid id was not rejected');
          })
          .catch((error) => {
            expect(error).to.be.an.instanceof(errors.InvalidTrackingStateError);
            done();
          });
    });

    it('adds participant to an event', (done) => {

      tracker.on('query', (query) => {
        query.response(TrackingItem.forge(eventAttributes));
      });

      TrackingService.createTrackingEvent(eventAttributes)
          .then(() => TrackingService.addEventParticipant(testId))
          .then((response) => {
            expect(response).to.have.deep.property('id', eventAttributes.id);
            expect(response).to.have.deep.property('attributes.name', eventAttributes.name);

            done();
          });
    });

    afterEach((done) => {
      tracker.uninstall();
      done();
    });

  });
});