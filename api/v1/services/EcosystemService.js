var _ = require('lodash');

var errors = require('../errors');
var Ecosystem = require('../models/Ecosystem');


module.exports.getAllEcosystems = function () {
	return Ecosystem.fetchAll();
}

module.exports.createEcosystem = function (name) {
	var ecosystem = Ecosystem.forge({name: name.toLowerCase()});

	return ecosystem.save()
		.catch((err) => err.code === errors.Constants.DupEntry, function (err) {
					var message = "An ecosystem with the given name already exists";
					var source = "name";
					throw new errors.InvalidParameterError(message, source);
		});
}

module.exports.deleteEcosystem = function (name) {
	return Ecosystem
		.findByName(name)
		.then(function (result) {
			if (_.isNull(result)) {
				var message = "An ecosystem with the given name does not exist";
				var source = "name";
				throw new errors.InvalidParameterError(message, source);
			}

			return result.destroy();
		});
}
