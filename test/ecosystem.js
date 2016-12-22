var _Promise = require('bluebird');

var chai = require('chai');
var sinon = require('sinon');

var errors = require('../api/v1/errors');
var utils = require('../api/v1/utils');
var User = require('../api/v1/models/User.js');
var EcosystemService = require('../api/v1/services/EcosystemService.js');

var config = require('../api/config');

var assert = chai.assert;
var expect = chai.expect;

describe('EcosystemService',function(){

    describe('createEcosystem',function(){
        var name;
        before(function(done){
            name = "testEcosystem"
            done();
        });
        it('creates a new ecosystem',function(done){
            var ecosystem = EcosystemService.createEcosystem(name);
            expect(ecosystem).to.eventually.have.deep.property("attributes.name", name).and.notify(done);
        });
        it('fails with a blank name',function(done){
            try{
                EcosystemService.createEcosystem("");
            }catch(e){
                expect(e).to.be.instanceof(errors.InvalidParameterError);
                done();
            }
        });
    });

});