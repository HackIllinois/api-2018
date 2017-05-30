const chai = require('chai');

const EcosystemService = require('../api/v1/services/EcosystemService.js');

const expect = chai.expect;
const tracker = require('mock-knex').getTracker();


function _patchInsertUpdate () {
    // adds a query handler to the mock database connection so that
    // it returns a result (i.e. on save for these tests)
	tracker.on('query', (query) => {
		query.response([]);
	});
}

describe('EcosystemService',() => {

	describe('createEcosystem',() => {
		let name;
		before((done) => {
			name = 'testEcosystem';
			done();
		});
		beforeEach((done) => {
			tracker.install();
			done();
		});
		it('creates a new ecosystem',(done) => {
			_patchInsertUpdate();
			const ecosystem = EcosystemService.createEcosystem(name);
			expect(ecosystem).to.eventually.have.deep.property('attributes.name', name.toLowerCase()).and.notify(done);
		});
		afterEach((done) => {
			tracker.uninstall();
			done();
		});
	});

	describe('getAllEcosystems', () => {
		before((done) => {
			done();
		});
		beforeEach((done) => {
			tracker.install();
			done();
		});
		it('retrieves all current ecosystems', (done) => {
			tracker.on('query', (query) => {
				query.response([{ name: 'testEcosystem' }]);
			});

			const ecosystems = EcosystemService.getAllEcosystems();
			expect(ecosystems).to.eventually.not.be.empty.and.notify(done);
		});
		afterEach((done) => {
			tracker.uninstall();
			done();
		});
	});

});
