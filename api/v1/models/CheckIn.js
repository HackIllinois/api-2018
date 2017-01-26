var _ = require('lodash');
var CheckIt = require('checkit');

var Model = require('./Model');
var CheckIn =  Model.extend({
    tableName: 'checkin',
    idAttribute: 'id',
    validations: {
        userId: ['required', 'integer'],
        checkedIn: ['required', 'boolean'],
        travel: ['required', 'string', registration.verifyTransportation],
        location: ['required', 'string', registration.verifyLocation],
        swag: ['required', 'boolean']
    }
});


CheckIn.findByUserId = function (id) {
    return CheckIn.where({ userId: id }).fetch();
}


CheckIn.prototype.validate = function () {
    var checkit = CheckIt(this.validations);

    checkit.run(this.attributes);
};


module.exports = CheckIn;