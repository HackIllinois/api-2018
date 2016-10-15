var Checkit = require('checkit');
var _Promise = require('bluebird');
var _ = require('lodash');

var Mentor = require('../models/Mentor');
var MentorProjectIdea = require('../models/MentorProjectIdea');
var errors = require('../errors');
var utils = require('../utils');

/**
* Registers a mentor and their project ideas for the given user
* @param  {Object} mentorObject a JSON object holding the mentor registration
* @param  {Object} user the user for which a mentor will be registered
* @return {Promise} resolving to an object in the same format as mentorObject, holding the saved models
* @throws InvalidParameterError when a mentor exists for the specified user
*/
module.exports.createMentor = function (mentorObject, user) {
  var userId = user.get('id');
  var mentorAttributes = mentorObject['mentor'];
  var mentorIdeas = mentorObject['ideas'];
  mentorAttributes['user_id'] = userId;
  if (!user.hasRoles(utils.roles.ORGANIZERS, false)) {
    delete mentorAttributes['status'];
  }
  var mentor = Mentor.forge(mentorAttributes);

  return mentor
  .validate()
  .catch(Checkit.Error, utils.errors.handleValidationError)
  .then(function (validated) {
    if (user.hasRole(utils.roles.MENTOR, false)) {
      var message = "The given user has already registered as a mentor";
      var source = "userId";
      throw new errors.InvalidParameterError(message, source);
    }
    return Mentor.transaction( function (t) {
      return UserRole.addRole(user, utils.roles.MENTOR, false, t)
      .then(function (result) {
        return mentor.save(null, { transacting: t });
      })
      .then(function (result) {
        var mentorAndIdeas = {
          'mentor': result,
          'ideas':  []
        };
        var mentorId = result.get('id');
        return _Promise.all(
          _.map(mentorIdeas, function(ideaAttributes) {
            ideaAttributes['mentorId'] = mentorId;
            var projectIdea = MentorProjectIdea.forge(ideaAttributes);
            return projectIdea.save(null, { transacting: t })
            .then( function(idea) {
              mentorAndIdeas['ideas'].push(idea);
              return idea;
            });
          })
        )
        .then(function (result) {
          return mentorAndIdeas;
        });
      });
    });
  })
  .then(function (result) {
    return _Promise.resolve(result);
  });
};

/**
* Finds a mentor by querying for the user_id
* @param  {Number} id the User ID to query
* @return {Promise} resolving to the associated Mentor model
* @throws {NotFoundError} when the requested mentor cannot be found
*/
module.exports.findMentorByUserId = function (user_id) {
  return Mentor
  .findByUserId(user_id)
  .then(function (result) {
    if (_.isNull(result)) {
      var message = "A mentor with the given user ID cannot be found";
      var source = "userId";
      throw new errors.NotFoundError(message, source);
    }
    var mentorAndIdeas = {
      'mentor': result,
      'ideas':  result.related('ideas')
    };
    return _Promise.resolve(mentorAndIdeas);
  });
};

/**
* Finds a mentor by querying for the given ID
* @param  {Number} id the ID to query
* @return {Promise} resolving to the associated Mentor model
* @throws {NotFoundError} when the requested mentor cannot be found
*/
module.exports.findMentorById = function (id) {
  return Mentor
  .findById(id)
  .then(function (result) {
    if (_.isNull(result)) {
      var message = "A mentor with the given ID cannot be found";
      var source = "id";
      throw new errors.NotFoundError(message, source);
    }
    var mentorAndIdeas = {
      'mentor': result,
      'ideas':  result.related('ideas')
    };
    return _Promise.resolve(mentorAndIdeas);
  });
};

/**
* Updates a mentor and their project ideas by relational user
* @param  {Object} mentorObject a JSON object holding the mentor registration
* @param  {Object} user the relational user of the mentor to be updated
* @return {Promise} resolving to an object in the same format as mentorObject, holding the saved models
* @throws InvalidParameterError when a mentor doesn't exist for the specified user
*/
module.exports.updateMentorbyUser = function (mentorObject, user) {
  var userId = user.get('id');
  var mentorAttributes = mentorObject['mentor'];
  var mentorIdeas = mentorObject['ideas'];
  delete mentorAttributes['status'];
  return Mentor
  .findByUserId(user.get('id'))
  .then(function (result) {
    if (_.isNull(result)) {
      var message = "A mentor with the given user ID cannot be found";
      var source = "userId";
      throw new errors.NotFoundError(message, source);
    }
    return _Promise.all(
      _.map(result.related('ideas'), function(idea) {
        return idea.destroy();
      })
    )
    .then(function(){
      return result;
    });
  })
  .then(function (mentor) {
    mentor.set(mentorAttributes);
    return mentor
    .validate()
    .catch(Checkit.Error, utils.errors.handleValidationError)
    .then(function (validated) {
      return Mentor.transaction( function(t) {
        return mentor.save(null, { transacting: t })
        .then( function(result) {
          var mentorAndIdeas = {
            'mentor': result,
            'ideas':  []
          };
          var mentorId = result.get('id');
          return _Promise.all(
            _.map(mentorIdeas, function(ideaAttributes) {
              ideaAttributes['mentorId'] = mentorId;
              var projectIdea = MentorProjectIdea.forge(ideaAttributes);
              return projectIdea.save(null, { transacting: t })
              .then( function(idea) {
                mentorAndIdeas['ideas'].push(idea);
                return idea;
              });
            })
          )
          .then(function (result) {
            return mentorAndIdeas;
          });
        });
      });
    });
  })
  .then(function (result) {
    return _Promise.resolve(result);
  });
};

/**
* Updates a mentor and their project ideas by id
* @param  {Object} mentorObject a JSON object holding the mentor registration
* @param  {Object} id the id of the mentor to be updated
* @return {Promise} resolving to an object in the same format as mentorObject, holding the saved models
* @throws InvalidParameterError when a mentor doesn't exist with the specified id
*/
module.exports.updateMentorbyId = function (mentorObject, id) {
  var mentorAttributes = mentorObject['mentor'];
  var mentorIdeas = mentorObject['ideas'];
  return Mentor
  .findById(id)
  .then(function (result) {
    if (_.isNull(result)) {
      var message = "A mentor with the given ID cannot be found";
      var source = "id";
      throw new errors.NotFoundError(message, source);
    }
    return _Promise.all(
      _.map(result.related('ideas'), function(idea) {
        return idea.destroy();
      })
    )
    .then(function(){
      return result;
    });
  })
  .then(function (mentor) {
    mentor.set(mentorAttributes);
    return mentor
    .validate()
    .catch(Checkit.Error, utils.errors.handleValidationError)
    .then(function (validated) {
      return Mentor.transaction( function(t) {
        return mentor.save(null, { transacting: t })
        .then( function(result) {
          var mentorAndIdeas = {
            'mentor': result,
            'ideas':  []
          };
          var mentorId = result.get('id');
          return _Promise.all(
            _.map(mentorIdeas, function(ideaAttributes) {
              ideaAttributes['mentorId'] = mentorId;
              var projectIdea = MentorProjectIdea.forge(ideaAttributes);
              return projectIdea.save(null, { transacting: t })
              .then( function(idea) {
                mentorAndIdeas['ideas'].push(idea);
                return idea;
              });
            })
          )
          .then(function (result) {
            return mentorAndIdeas;
          });
        });
      });
    });
  })
  .then(function (result) {
    return _Promise.resolve(result);
  });
};
