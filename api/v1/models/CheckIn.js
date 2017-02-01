var _ = require('lodash');
var checkin = require('../utils/check_in');
var CheckIt = require('checkit');


var Model = require('./Model');
var CheckIn =  Model.extend({
    tableName: 'checkins',
    idAttribute: 'id',
    validations: {
        userId: ['required', 'integer'],
        checkedIn: ['required', 'boolean'],
        location: ['required', 'string', checkin.verifyLocation],
        swag: ['required', 'boolean']
    }
});

CheckIn.findByUserId = function (id) {
    return CheckIn.where({ user_id: id }).fetch();
}


module.exports = CheckIn;