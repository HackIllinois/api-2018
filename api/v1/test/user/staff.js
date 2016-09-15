var chai = require('chai');
var assert = chai.assert;
var chaiHttp = require('chai-http');

var api = require('../../../../api');
var UserService = require('../../services/UserService');
var User = require('../../models/User');
var testHelper = require('../testHelper');

var consts = require('../testConsts');

chai.use(chaiHttp);
var should = chai.should();


describe("ADMIN access test", function() {
        it('can we obtain credentials using superuser?', function(done){
                var key;

                var req = {
                        'email': process.env.HACKILLINOIS_SUPERUSER_EMAIL,
                        'password': process.env.HACKILLINOIS_SUPERUSER_PASSWORD
                };

                chai.request(api)
                        .post('/v1/auth')
                        .send(req)
                        .end(function(err, res) {
                                res.should.have.status(200);
                                res.body.data.auth.should.not.be.null;
                                key = res.body.data.auth;

                                UserService.findUserByEmail(process.env.HACKILLINOIS_SUPERUSER_EMAIL)
                                        .then(function(user) {
                                                assert.equal(user.attributes.id, 1, "Super user should be first user");
                                                done();
                                        });
                        });
        });
});

// describe('/v1/user staff functionality', function() {
//     var key;
//     var id;

//     before(function() {
//         // grab a brand new authentication token for a staffed user
//      console.log(process.env.HACKILLINOIS_SUPERUSER_EMAIL)
//         var req = {
//             "email": process.env.HACKILLINOIS_SUPERUSER_EMAIL,
//             "password": process.env.HACKILLINOIS_SUPERUSER_PASSWORD
//         };

//         var staff_req = {
//             "email": consts.DUMMY_USER.email,
//             "password": consts.DUMMY_USER.password
//         };

//         // Create a dummy staff user to use for testing
//         chai.request(api)
//             .post('/v1/auth/')
//             .send(req)
//             .end(function(err, res) {
//                 res.should.have.status(200);
//                 res.body.data.auth.should.not.be.null;
//                 key = res.body.data.auth;
//                 chai.request(api)
//                     .post('/v1/user/accredited')
//                     .send(staff_req)
//                     .set('Authorization', key)
//                     .end(function(err, res) {
//                         res.should.have.status(200);
//                         res.body.data.auth.should.not.be.null;
//                         key = res.body.data.auth;
//                         UserService.findUserByEmail(consts.DUMMY_USER.email)
//                             .then(function (user) {
//                                 id = user.attributes.id;
//                              console.log('before done');
//                             });
//                     });
//             });
//     });

//     after(function() {
//      console.log("running after");
//         UserService.findUserByEmail(consts.DUMMY_USER.email)
//             .then(function(result) {
//                 result.destroy();
//                 UserService.findUserByEmail("tommypacker@gmail.com")
//                     .then(function(result) {
//                         result.destroy();
//                     });
//             });
//     });

//     describe('POST /user/', function() {
//         it('Staff should be able to create Hackers', function(done) {
//             var req = {
//                 "email": "tommypacker@gmail.com",
//                 "role": "HACKER"
//             };

//             chai.request(api)
//                 .post('/v1/user')
//                 .send(req)
//                 .set('Authorization', key)
//                 .end(function(err, res) {
//                     testHelper.userAssertHelper(res);
//                     res.body.data.role.should.equal('HACKER');
//                 });
//         });

//         // TODO
//         /////////////////////////////////////////////////////////////////////
//         // it('Staff should be NOT able to create staff', function(done) { //
//         //     var req = {                                                 //
//         //         "email": "test@example.com",                            //
//         //         "role": "STAFF"                                         //
//         //     };                                                          //
//         //                                                                 //
//         //     chai.request(api)                                           //
//         //         .post('/v1/user/accredited')                            //
//         //         .send(req)                                              //
//         //         .set('Authorization', key)                              //
//         //         .end(function(err, res) {                               //
//         //             testHelper.userAssertHelper(res);                   //
//         //             res.body.data.role.should.equal('STAFF');           //
//         //             done();                                             //
//         //         });                                                     //
//         // });                                                             //
//         /////////////////////////////////////////////////////////////////////
//     });

//     describe('GET /user/:id/', function() {
//         it('Staff should be able to access own user id', function(done) {
//             chai.request(api)
//                 .get('/v1/user/' + id)
//                 .set('Authorization', key)
//                 .end(function(err, res) {
//                     testHelper.userAssertHelper(res);
//                 });
//         });

//         it('Staff should be able to access other user ids', function(done) {
//             UserService.findUserByEmail("tommypacker@gmail.com")
//                 .then(function(user) {
//                     chai.request(api)
//                         .get('/v1/user/' + user.attributes.id)
//                         .set('Authorization', key)
//                         .end(function(err, res) {
//                             testHelper.userAssertHelper(res);
//                         });
//                 });
//         });
//     });
// });
