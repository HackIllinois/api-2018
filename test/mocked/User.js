
var User = require('../../api/v1/models/User.js');
var _Promise = require('bluebird');

User.findById = function(){

}
User.findByEmail = function(email){
    var tUser = new User(); tUser.attributes.id = 1;
    return _Promise.resolve(tUser);
}
User.create = function(){

}