
var User = require('../../api/v1/models/User.js');
var _Promise = require('bluebird');

User.findById = function(){

};
User.findByEmail = function(email){
    if (email=='valid@email.com') {
        var tUser = User.forge({email: email,password: 'password1'});
        tUser.attributes.id = 1;
        return _Promise.resolve(tUser);
    }else{
        return _Promise.resolve(null);
    }
};
User.create = function(email,password,role){
    var tUser = User.forge({email: email,password: 'password1',role:role});
    return tUser;
};
