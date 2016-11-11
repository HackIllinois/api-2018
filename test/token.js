var _Promise = require('bluebird');

var chai = require('chai');
var sinon = require('sinon');

var errors = require('../api/v1/errors');
var utils = require('../api/v1/utils');
var TokenService = require('../api/v1/services/TokenService.js');
var Token = require('../api/v1/models/Token.js');
var User = require('../api/v1/models/User.js');
var _ = require('lodash');

var shelf = require('bookshelf');


var assert = chai.assert;
var expect = chai.expect;

describe('TokenService',function(){
    describe('findTokenByValue',function(){
        var testToken;
        before(function(done){
            tokenVal = utils.crypto.generateResetToken();
            testToken = Token.forge({type: 'DEFAULT', value: tokenVal, user_id: 1});

            _findByValue = sinon.stub(Token,'findByValue');
            _findByValue.withArgs(tokenVal).returns(_Promise.resolve(testToken));
            _findByValue.withArgs(sinon.match.string).returns(_Promise.resolve(null));

            done();
        });

        it('finds valid token',function(done){
            var found = TokenService.findTokenByValue(tokenVal,'DEFAULT');
            expect(found).to.eventually.have.deep.property("attributes.user_id", 1,"user ID should be 1")
                .then(function(){
                    expect(found).to.eventually.have.deep.property("attributes.value", tokenVal,"token value sould be "+tokenVal)
                        .and.notify(done);
                });
        });
        it('throws error for invalid scope',function(done){
            // TODO structure from 'user.js' was not working for catching this error; refactor
            try {
                TokenService.findTokenByValue(tokenVal, 'INVALID');
            }catch(e){
                expect(e).to.be.instanceof(TypeError);
                done();
            }
        });
        it('throws error with expired token and calls delete on token',function(done){
            var _get = sinon.stub(Token.prototype,'get');
            _get.withArgs('created').returns(0);
            var _destroy = sinon.stub(Token.prototype,'destroy');
            var found = TokenService.findTokenByValue(tokenVal,'DEFAULT');
            expect(found).to.eventually.be.rejectedWith(errors.TokenExpirationError)
                .then(function(){
                    expect(_destroy.neverCalledWith()).to.equal(false);
                    _get.restore;
                    _destroy.restore;
                    done();
                });
        });
        it('throws error if invalid token',function(done){
            var found = TokenService.findTokenByValue('invalid','DEFAULT');
            expect(found).to.eventually.be.rejectedWith(errors.NotFoundError).and.notify(done);
        });

        after(function(done){
            _findByValue.restore();
            done();
        });
    });

    describe('generateToken',function(){ 
        var testUser; 
        var testToken; 
        before(function(done){

            var _mockedTokens = {
                invokeThen : function(){
                    return _Promise.resolve(null);
                }
            }
            var _mockedWhere = {
                fetchAll : function(){
                    return _Promise.resolve(_mockedTokens);
                }
            };

            testUser = User.forge({ id: 1, email: 'new@example.com' }); 
            testToken = Token.forge({type: 'DEFAULT', value: tokenVal, user_id: 1});  

            _where = sinon.stub(Token,'where'); 
            _where.returns(_mockedWhere);

            _save = sinon.stub(Token.prototype,'save'); 
            _save.returns(_Promise.resolve(null));  
            done(); 
        }); 
        it('generates a new token',function(done){ 
            var token = TokenService.generateToken(testUser,'7d'); 
            expect(token).to.eventually.be.a('string')
                .then(function(data){
                    expect(data.length).to.equal(36);
                    done();
                });
        }); 
    });
});