const _Promise = require('bluebird');
const checkit = require('checkit');

const chai = require('chai');
const sinon = require('sinon');

const errors = require('../api/v1/errors');
const utils = require('../api/v1/utils');
const EventService = require('../api/v1/services/EventService.js');
const EventLocation = require('../api/v1/models/EventLocation.js');
const Event = require('../api/v1/models/Event.js');
const Location = require('../api/v1/models/Location.js');

const assert = chai.assert;
const expect = chai.expect;
const tracker = require('mock-knex').getTracker();


describe('EventService', () => {
  describe('getAllLocations', () => {

    let testLocations;
    let _fetchAll;

    before((done) => {
      testLocations = [];

      testLocations[0] = Location.forge({
        id: 1,
        name: 'test location 1',
        latitude: 20,
        longitude: 30
      });

      testLocations[1] = Location.forge({
        id: 2,
        name: 'test location 2',
        latitude: 40,
        longitude: 10
      });

      _fetchAll = sinon.spy(Location, 'fetchAll');

      done();
    });

    beforeEach((done) => {
      tracker.install();
      done();
    });

    it('gets all locations', (done) => {
      tracker.on('query', (query) => {
        query.response([ testLocations ]);
      });

      EventService.getAllLocations()
          .then((response) => {
            let location = response.models[0].attributes[0].attributes;
            expect(location).to.have.deep.property('id', testLocations[0].id);
            expect(location).to.have.deep.property('name', testLocations[0].attributes.name);

            location = response.models[0].attributes[1].attributes;
            expect(location).to.have.deep.property('id', testLocations[1].id);
            expect(location).to.have.deep.property('name', testLocations[1].attributes.name);

            assert(_fetchAll.calledOnce, 'fetchAll() not called once');

            done();
          });
    });

    afterEach((done) => {
      tracker.uninstall();
      _fetchAll.reset();
      done();
    });

    after((done) => {
      _fetchAll.restore();
      done();
    });
  });

  describe('createLocation', () => {

    let locationParams;
    let invalidLocationParams;
    let _forge;
    let _save;

    before((done) => {
      locationParams = {
        id: 1,
        name: 'example location',
        latitude: 20,
        longitude: 30
      };
      invalidLocationParams = {
        id: 1,
        latitude: '89',
        longitude: 30
      };

      _forge = sinon.spy(Location, 'forge');
      _save = sinon.spy(Location.prototype, 'save');

      done();
    });

    beforeEach((done) => {
      tracker.install();
      done();
    });

    it('creates a valid location', (done) => {
      tracker.on('query', (query) => {
        query.response([ [ Location.forge(locationParams) ] ]);
      });

      EventService.createLocation(locationParams)
          .then((location) => {
            expect(location).to.have.deep.property('id', locationParams.id);
            expect(location).to.have.deep.property('attributes.name', locationParams.name);
            expect(location).to.have.deep.property('attributes.latitude', locationParams.latitude);
            expect(location).to.have.deep.property('attributes.longitude', locationParams.longitude);

            assert(_forge.called, 'forge() not called');
            assert(_save.calledOnce, 'save() not called once');

            done();
          });
    });

    it('rejects a duplicate location', (done) => {
      tracker.on('query', (query) => {
        const error = new Error();
        error.code = errors.Constants.DupEntry;
        query.reject(error);
      });

      const _duplicateEntryError = sinon.spy(utils.errors, 'DuplicateEntryError');
      const _handleDuplicateEntryError = sinon.spy(utils.errors, 'handleDuplicateEntryError');

      EventService.createLocation(locationParams)
          .then(() => {
            assert.fail('Duplicate location was not rejected');
          })
          .catch((error) => {
            assert(_forge.called, 'forge() not called');
            assert(_save.calledOnce, 'save() not called once');
            assert(_duplicateEntryError.calledOnce, 'duplicateEntryError() not called once');
            assert(_handleDuplicateEntryError.calledOnce, 'handleDuplicateEntryError() not called once');

            expect(error).to.be.an.instanceof(errors.InvalidParameterError);

            _duplicateEntryError.restore();
            _handleDuplicateEntryError.restore();

            done();
          });
    });

    it('rejects an invalid location', (done) => {
      EventService.createLocation(invalidLocationParams)
          .then(() => {
            assert.fail('Invalid location was not rejected');
          })
          .catch((error) => {
            assert(_forge.called, 'forge() not called');
            assert(_save.calledOnce, 'save() not called once');
            expect(error).to.be.an.instanceof(checkit.Error);

            done();
          });
    });

    afterEach((done) => {
      tracker.uninstall();
      _forge.reset();
      _save.reset();
      done();
    });

    after((done) => {
      _forge.restore();
      _save.restore();
      done();
    });
  });

  describe('getEvents', () => {

    let testLocations;
    let testEvents;
    let _fetchAll;

    before((done) => {
      testLocations = [];

      testLocations[0] = Location.forge({
        id: 1,
        name: 'test location 1',
        latitude: 20,
        longitude: 30
      });

      testLocations[1] = Location.forge({
        id: 2,
        name: 'test location 2',
        latitude: 40,
        longitude: -50
      });

      testEvents = [];

      testEvents[0] = Event.forge({
        id: 1,
        name: 'test event',
        description: 'lorem ipsum',
        startTime: '01/01/0000',
        endTime: '01/01/0001',
        tag: 'PRE_EVENT'
      });

      testEvents[1] = Event.forge({
        id: 2,
        name: 'test event 2',
        description: 'lorem ipsum 2',
        startTime: '01/01/0000',
        endTime: '01/01/2500',
        tag: 'PRE_EVENT'
      });

      testEvents[2] = Event.forge({
        id: 3,
        name: 'test event 3',
        description: 'lorem ipsum 3',
        startTime: '01/01/0005',
        endTime: '01/01/3000',
        tag: 'PRE_EVENT'
      });

      testEvents[0].related('locations').add(EventLocation.forge({id: '1', eventId: testEvents[0].id,
        locationId: testLocations[0].id}));

      testEvents[1].related('locations').add(EventLocation.forge({id: '2', eventId: testEvents[1].id,
        locationId: testLocations[1].id}));

      _fetchAll = sinon.stub(Event, 'fetchAll');

      done();
    });

    it('gets all events with locations', (done) => {
      _fetchAll.withArgs({withRelated: [ 'locations' ]}).returns(_Promise.resolve(testEvents.slice(0, 2)));

      EventService.getEvents(false)
          .then((events) => {
            assert(events.length == 2, 'More events returned than expected (2), received (' + events.length + ')');

            expect(events[0]).to.have.deep.property('id', testEvents[0].id);
            expect(events[0]).to.have.deep.property('attributes.name', testEvents[0].attributes.name);

            expect(events[1]).to.have.deep.property('id', testEvents[1].id);
            expect(events[1]).to.have.deep.property('attributes.name', testEvents[1].attributes.name);


            assert(_fetchAll.calledOnce);

            done();
          });
    });

    it('gets all occurring events with locations', (done) => {
      _fetchAll.withArgs({withRelated: [ 'locations' ]}).returns(_Promise.resolve(testEvents.slice(1, 2)));

      const _query = sinon.stub(Event, 'query');
      _query.returns(Event);

      EventService.getEvents(true)
          .then((events) => {
            assert(events.length == 1, 'More events returned than expected (1), received (' + events.length + ')');

            expect(events[0]).to.have.deep.property('id', testEvents[1].id);
            expect(events[0]).to.have.deep.property('attributes.name', testEvents[1].attributes.name);

            assert(_fetchAll.calledOnce);
            assert(_query.called);

            _query.restore();

            done();
          });
    });

    afterEach((done) => {
      _fetchAll.reset();
      done();
    });

    after((done) => {
      _fetchAll.restore();
      done();
    });

  });

  describe('createEvent', () => {

    let eventParams;
    let locationParams;
    let _save;

    before((done) => {
      eventParams = {
        id: 1,
        name: 'test event',
        description: 'lorem ipsum',
        startTime: '01/01/0000',
        endTime: '01/01/0001',
        tag: 'PRE_EVENT'
      };

      locationParams = [];

      locationParams[0] = {
        id: 2,
        locationId: 3
      };

      locationParams[1] = {
        id: 3,
        locationId: 4
      };

      _save = sinon.spy(Event.prototype, 'save');

      done();
    });

    beforeEach((done) => {
      tracker.install();
      done();
    });

    it('creates a valid event with locations', (done) => {
      tracker.on('query', (query) => {
        const responseEvent = Event.forge(eventParams);
        locationParams[0].eventId = responseEvent.id;
        locationParams[1].eventId = responseEvent.id;
        responseEvent.related('locations').add(locationParams[0]);
        responseEvent.related('locations').add(locationParams[1]);
        query.response([ responseEvent ]);
      });

      EventService.createEvent({event: eventParams, eventLocations: locationParams})
          .then((response) => {
            const event = response.event;
            const locations = response.eventLocations;
            expect(event).to.have.deep.property('id', eventParams.id);
            expect(event).to.have.deep.property('attributes.name', eventParams.name);
            expect(event).to.have.deep.property('attributes.tag', eventParams.tag);
            expect(locations[0]).to.have.deep.property('id', locationParams[0].id);
            expect(locations[1]).to.have.deep.property('id', locationParams[1].id);
            expect(locations[0]).to.have.deep.property('attributes.eventId', eventParams.id);
            expect(locations[1]).to.have.deep.property('attributes.eventId', eventParams.id);

            assert(_save.calledOnce, 'save() not called once');

            done();
          });
    });

    it('creates a valid event without locations', (done) => {
      tracker.on('query', (query) => {
        const responseEvent = Event.forge(eventParams);
        query.response([ responseEvent ]);
      });

      EventService.createEvent({event: eventParams})
          .then((response) => {
            const event = response.event;
            expect(event).to.have.deep.property('id', eventParams.id);
            expect(event).to.have.deep.property('attributes.name', eventParams.name);
            expect(event).to.have.deep.property('attributes.tag', eventParams.tag);

            assert(response.eventLocations == null, 'events incorrectly included');

            assert(_save.calledOnce, 'save() not called once');

            done();
          });
    });

    it('rejects a duplicate event', (done) => {
      tracker.on('query', (query) => {
        const error = new Error();
        error.code = errors.Constants.DupEntry;
        query.reject(error);
      });

      const _duplicateEntryError = sinon.spy(utils.errors, 'DuplicateEntryError');
      const _handleDuplicateEntryError = sinon.spy(utils.errors, 'handleDuplicateEntryError');

      EventService.createEvent({event: eventParams, eventLocations: locationParams})
          .then(() => {
            assert.fail('Duplicate event was not rejected');
          })
          .catch((error) => {
            assert(_duplicateEntryError.calledOnce, 'duplicateEntryError() not called once');
            assert(_handleDuplicateEntryError.calledOnce, 'handleDuplicateEntryError() not called once');

            expect(error).to.be.an.instanceof(errors.InvalidParameterError);

            _duplicateEntryError.restore();
            _handleDuplicateEntryError.restore();

            done();
          });
    });

    afterEach((done) => {
      tracker.uninstall();
      _save.reset();
      done();
    });

    after((done) => {
      _save.restore();
      done();
    });
  });
});