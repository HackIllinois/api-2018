const _ = require('lodash');

const utils = require('../utils');
const errors = require('../errors');
const Ecosystem = require('../models/Ecosystem');


module.exports.getAllEcosystems = function () {
  return Ecosystem.fetchAll();
};

module.exports.createEcosystem = function (name) {
  const ecosystem = Ecosystem.forge({name: name.toLowerCase()});

  return ecosystem.save()
		.catch(
			utils.errors.DuplicateEntryError,
			utils.errors.handleDuplicateEntryError('An ecosystem with the given name already exists', 'name')
		);
};

module.exports.deleteEcosystem = function (name) {
  return Ecosystem
		.findByName(name)
		.then((result) => {
  if (_.isNull(result)) {
    const message = 'An ecosystem with the given name does not exist';
    const source = 'name';
    throw new errors.InvalidParameterError(message, source);
  }

  return result.destroy();
});
};
