const checkin = require('../utils/check_in');

const Model = require('./Model');
const CheckIn = Model.extend({
  tableName: 'checkins',
  idAttribute: 'id',
  validations: {
    userId: ['required', 'integer'],
    location: ['required', 'string', checkin.verifyLocation],
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
