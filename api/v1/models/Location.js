const Model = require('./Model');

const Location = Model.extend({
  tableName: 'locations',
  idAttribute: 'id',
  validations: {
    name: ['required', 'string', 'maxLength:255'],
    latitude: ['required', 'number'],
    longitude: ['required', 'number']
  }
});

module.exports = Location;
