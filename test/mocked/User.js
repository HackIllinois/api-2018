var mockery = require('mockery');
var User = require('../../api/v1/models/User.js');
var _Promise = require('bluebird');

var MockedUser = {

    findById : function (id) {
        if (id == 1) {
            var tUser = User.forge({email: 'valid@example.com', password: 'password1'});
            tUser.attributes.id = 1;
            return _Promise.resolve(tUser);
        } else {
            return _Promise.resolve(null);
        }
    },
    findByEmail : function(email) {
        if (email == 'valid@example.com') {
            var tUser = User.forge({email: email, password: 'password1'});
            tUser.attributes.id = 1;
            return _Promise.resolve(tUser);
        } else {
            return _Promise.resolve(null);
        }
    },
    create : function (email, password, role) {
        var tUser = User.forge({email: email, password: 'password1', role: role});
        return tUser;
    },
    forge : function(user){
        return User.forge(user);
    }
};
// MUST ENABLE FOR MOCKERY - (necessary for global use of the mocked user)
//mockery.registerMock('../models/User', MockedUser);
