var _ = require('lodash');
var checkin = require('../utils/check_in');
var CheckIt = require('checkit');


var Model = require('./Model');
var CheckIn =  Model.extend({
    tableName: 'checkins',
    idAttribute: 'id',
    validations: {
        userId: ['required', 'integer'],
        location: ['required', 'string', checkin.verifyLocation],
        swag: ['required', 'boolean']
    },
    parse: function (attrs) {
        attrs = Model.prototype.parse(attrs);
        attrs.checkedIn = !!attrs.checkedIn;
        attrs.swag = !!attrs.swag;
        return attrs;
    }
});

CheckIn.findByUserId = function (id) {
    return CheckIn.where({ user_id: id }).fetch();
}


module.exports = CheckIn;
