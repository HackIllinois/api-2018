//const _Promise = require('bluebird');

const chai = require('chai');
const sinon = require('sinon');
const _ = require('lodash');

//const UserService = require('../api/v1/models/UserService');
const StatService = require('../api/v1/services/StatsService');
const Stat = require('../api/v1/models/Stat');

const assert = chai.assert;
// const expect = chai.expect;
const tracker = require('mock-knex').getTracker();

const expect = chai.expect;

describe('StatService', () => {
  describe('increment', () => {
    let _createStat;
    //let _find;
    let testStat;

    before((done) => {
      testStat = { category: 'registration', stat: 'testStat', field: 'testField' };
      _createStat = sinon.spy(Stat, 'create');
      //_find = sinon.spy(Stat, 'find');
      done();
    });

    beforeEach((done) => {
      tracker.install();
      done();
    });

    afterEach((done) => {
      tracker.uninstall();
      done();
    });

    it('creates a new stat', (done) => {
      const testStatClone = _.clone(testStat);
 
      tracker.on('query', (query) => {
        query.response([ '1' ]);
      });

      const stat = StatService.createStat(
        testStatClone.category,
        testStatClone.stat,
        testStatClone.field
      );

      // chai.expect(!_.isNull(stat));

      stat.bind(this).then(() => {
        assert(_createStat.calledOnce, 'Stat forge not called with right parameters');
        return done();
      }).catch((err) => done(err));
    });

    after((done) => {
      _createStat.restore();
      done();
    });
  });

  describe('exists', () => {
    let _existsStat;
    let testStat;

    before((done) => {
      testStat = { category: 'registration', stat: 'testStat', field: 'testField' };
      StatService.createStat(
        testStat.category,
        testStat.stat,
        testStat.field
      );
      _existsStat = sinon.spy(Stat, 'exists');
      done();
    });

    beforeEach((done) => {
      tracker.install();
      done();
    });

    afterEach((done) => {
      tracker.uninstall();
      done();
    });

    it('checks if stat exists', (done) => {
      const testStatClone = _.clone(testStat);
 
      tracker.on('query', (query) => {
        query.response([ { 'count(*)': 1 } ]);
      });

      const stat = StatService.statExists(
        testStatClone.category,
        testStatClone.stat,
        testStatClone.field
      );

      assert(_existsStat.calledOnce, 'Stat exists not called with right parameters');
      expect(stat)
      .to.eventually.equal(true)
      .and.notify(done);
    });

    after((done) => {
      _existsStat.restore();
      done();
    });
  });
});
