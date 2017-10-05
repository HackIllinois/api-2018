const Model = require('./Model');
const validators = require('../utils/validators');

const LOCATIONS = ['NONE', 'ECEB', 'SIEBEL', 'DCL'];
const CheckIn = Model.extend({
  tableName: 'checkins',
  idAttribute: 'id',
  validations: {
    userId: ['required', 'integer'],
    location: ['required', 'string', validators.in(LOCATIONS)],
    swag: ['required', 'boolean']
  },
  parse: function(attrs) {
    attrs = Model.prototype.parse(attrs);
    if (Number.isInteger(attrs.swag)) {
      attrs.swag = !!attrs.swag;
    }
    return attrs;
  }
});

CheckIn.findByUserId = function(id) {
  return CheckIn.where({
    user_id: id
  })
    .fetch();
};


module.exports = CheckIn;
