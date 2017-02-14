var Model = require('./Model');

var UniversalTrackingItem = Model.extend({
    tableName: 'event_tracking',
    idAttribute: 'id',
    hasTimestamps: ['created'],
    validations: {
        name: ['required', 'string', 'maxLength:255'],
        duration: ['required', 'naturalNonZero']
    }
});

UniversalTrackingItem.findByName = function (searchName) {
    return UniversalTrackingItem.where({ name: searchName }).fetch();
};

module.exports = UniversalTrackingItem;