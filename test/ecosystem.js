var chai = require('chai');

var EcosystemService = require('../api/v1/services/EcosystemService.js');

var expect = chai.expect;
var tracker = require('mock-knex').getTracker();


function _patchInsertUpdate () {
    // adds a query handler to the mock database connection so that
    // it returns a result (i.e. on save for these tests)
    tracker.on('query', function (query) {
        query.response([]);
    });
}

describe('EcosystemService',function(){

    describe('createEcosystem',function(){
        var name;
        before(function(done){
            name = 'testEcosystem';
            done();
        });
        beforeEach(function (done) {
            tracker.install();
            done();
        });
        it('creates a new ecosystem',function(done){
            _patchInsertUpdate();
            var ecosystem = EcosystemService.createEcosystem(name);
            expect(ecosystem).to.eventually.have.deep.property('attributes.name', name.toLowerCase()).and.notify(done);
        });
        afterEach(function (done) {
            tracker.uninstall();
            done();
        });
    });

    describe('getAllEcosystems', function () {
        before(function(done){
            done();
        });
        beforeEach(function (done) {
            tracker.install();
            done();
        });
        it('retrieves all current ecosystems', function(done){
            tracker.on('query', function (query) {
                query.response([{ name: 'testEcosystem' }]);
            });

            var ecosystems = EcosystemService.getAllEcosystems();
            expect(ecosystems).to.eventually.not.be.empty.and.notify(done);
        });
        afterEach(function (done) {
            tracker.uninstall();
            done();
        });
    });

});
