let chai = require('chai');

let errors = require('../api/v1/errors');
let utils = require('../api/v1/utils');
let User = require('../api/v1/models/User.js');
let AuthService = require('../api/v1/services/AuthService.js');

let jwt = require('jsonwebtoken');

let expect = chai.expect;

describe('AuthService', () => {

    describe('issueForUser', () =>{
        var testUser;

        before((done) => {
            testUser = User.forge({ id: 1, email: 'new@example.com' });
            testUser.related('roles').add({ role: utils.roles.ATTENDEE });

            done();
        });
        it('issues a token for a valid user', (done) => {
            var token = AuthService.issueForUser(testUser);
            token.then(function(data){
                var decoded = jwt.decode(data, {complete: true});

                expect(decoded.payload.email).to.equal('new@example.com');
                expect(decoded.payload.roles[0].role).to.equal('ATTENDEE');
                expect(decoded.payload.sub).to.equal('1');

                done();
            });
        });
        it('refuses a token for a blank user',function(done){
            try{
                AuthService.issueForUser(new User());
            }catch(e){
                expect(e).to.be.instanceof(TypeError);
                done();
            }
        });
    });

    describe('verify',function(){
        var testUser;
        before(function(done){
            testUser = User.forge({ id: 1, email: 'new@example.com' });
            testUser.related('roles').add({ role: utils.roles.ATTENDEE });
            done();
        });
        it('verifies a valid auth token',function(done){
            AuthService.issueForUser(testUser)
				.then(function(token){
    var verification = AuthService.verify(token);
    expect(verification).to.eventually.have.deep.property('email','new@example.com').then(function () {
        expect(verification).to.eventually.have.deep.property('sub', '1').and.notify(done);
    });
});
        });
        it('refuses a fake auth token',function(done){
            var token = 'FAKE TOKEN';
            var verification = AuthService.verify(token);
            expect(verification).to.eventually.be.rejectedWith(errors.UnprocessableRequestError).and.notify(done);
        });
    });

});
