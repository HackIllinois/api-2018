const _Promise = require('bluebird');
const _ = require('lodash');

const Model = require('./Model');
const validators = require('../utils/validators');

const CATEGORIES = ['registration', 'rsvp', 'liveevent'];

const Stat = Model.extend({
  tableName: 'stats',
  idAttribute: 'id',
  validations: {
    category: ['required', 'string', validators.in(CATEGORIES)],
    stat: ['required', 'string'],
    field: ['required', 'string'],
    count: ['required', 'integer'] // Change to default 0?
  }
});

/**
 * Return true if the stat exists, false otherwise.
 * @param {String} category
 * @param {String} stat
 * @param {String} field
 * @return {Promise<boolean>} a Promise boolean, true if stat exists, false otherwise
 */
Stat.exists = (category, stat, field) => {
  const s = Stat.where({
    category: category,
    stat: stat,
    field: field
  }).query().count().then((count) => _Promise.resolve(count[0]['count(*)'] > 0));

  return s;
};

/**
 * Adds a row with category `category`, stat `stat`, and field `field`.
 * Initializes count to 0
 * @param {String} category
 * @param {String} stat
 * @param {String} field
 * @return {Promise<Stat>} a Promise resolving to the newly-created Stat 
 */
Stat.create = (category, stat, field) => {
  const s = Stat.forge({
    category: category,
    stat: stat,
    field: field,
    count: 0
  });

  return s.save();
};

/**
 * Increments the specified stat by the amount
 * @param {String} category
 * @param {String} stat
 * @param {String} field
 * @param {Number} amount defaults to 1
 * @return {Promise<Stat>} a Promise resolving to the updating Stat model
 */
Stat.increment = (category, stat, field, amount) => {
  if (_.isUndefined(amount)) {
    amount = 1;
  }

  const s = Stat.query((qb) => {
    qb.where('category', '=', category);
    qb.where('stat', '=', stat);
    qb.where('field', '=', field);
  }).fetch();

  return s.then((model) => {
    if(model == null) {
      return Stat.create(category, stat, String(field)).then((createdModel) => {
        createdModel.set('count', createdModel.get('count') + amount);
        return createdModel.save(); 
      });
    } 
    model.set('count', model.get('count') + amount);
    return model.save();
    
  }).catch(() => null);
};

module.exports = Stat;
