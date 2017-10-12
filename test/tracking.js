const chai = require('chai');
const sinon = require('sinon');

const errors = require('../api/v1/errors');
const TrackingItem = require('../api/v1/models/TrackingEvent');
const TrackingService = require('../api/v1/services').TrackingService;

const assert = chai.assert;
const expect = chai.expect;
const tracker = require('mock-knex').getTracker();

const cache = require('../api/cache')
    .instance();

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
      cache.flushdb('trackedEvent');
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

      const validEvent = TrackingService.createTrackingEvent(testTrackingAttributes[1]);
      validEvent.then(() => {
        const invalidEvent = TrackingService.createTrackingEvent(testTrackingAttributes[0]);
        expect(invalidEvent).to.eventually.be.rejectedWith(errors.InvalidTrackingStateError).and.notify(done);
      });
    });

    it('rejects an invalid tracking event', (done) => {
      const event = TrackingService.createTrackingEvent(testInvalidTrackingAttributes[0]);
      expect(event).to.eventually.be.rejectedWith(errors.InvalidParameterError).and.notify(done);
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
      cache.flushdb('trackedEvent');
      done();
    });

    it('fails when no event is currently being tracked', (done) => {
      const participant = TrackingService.addEventParticipant(testId);
      expect(participant).to.eventually.be.rejectedWith(errors.InvalidTrackingStateError).and.notify(done);
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
