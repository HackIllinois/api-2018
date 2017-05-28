var Model = require('./Model');

var Ecosystem = Model.extend({
    tableName: 'ecosystems',
    idAttribute: 'id',
    validations: {
        name: ['required', 'string', 'maxLength:100']
    }
});

Ecosystem.findByName = function (name) {
    name = name.toLowerCase();
    return Ecosystem.where({ name:name }).fetch();
};

module.exports = Ecosystem;