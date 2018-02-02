const Checkit = require('checkit');
const _Promise = require('bluebird');
const _ = require('lodash');

const Recruiter = require('../models/Recruiter');
const errors = require('../errors');
const utils = require('../utils');

module.exports.findById = (id, favorite) => {
  Recruiter.findById(id)
    .then(function(result) {
      if(_.isNull(result)) {
        const message = 'A user with the given ID cannot be found';
        const source = 'id';
        throw new errors.NotFoundError(message, source);
      }

      return _Promise.resolve(result);
    });
}
