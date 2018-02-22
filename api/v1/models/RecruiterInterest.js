const Model = require('./Model');

const RecruiterInterest = Model.extend({
  tableName: 'recruiter_interests',
  hasTimestamps: ['created', 'updated'],
  idAttribute: 'app_id',
  validations: {
    recruiterId: ['required', 'integer'],
    attendeeId: ['required', 'integer'],
    comments: [ 'string' ],
    favorite: [ 'boolean' ]
  }
});

RecruiterInterest.findById = (id) => RecruiterInterest.where({
  app_id: id
})
  .fetch();

RecruiterInterest.findByRecruiterId = (id) => RecruiterInterest.where({
  recruiter_id: id
})
  .fetchAll();

RecruiterInterest.findByAttendeeId = (id) => RecruiterInterest.where({
  attendee_id: id
})
  .fetchAll();

RecruiterInterest.updateInterest = (appId, comments, favorite) => RecruiterInterest
    .where({app_id: appId})
    .fetch()
    .then((result) => {
      result.set({ comments: comments, favorite: favorite });
      return result.save({ app_id: appId }, { method: 'update'});
    });

module.exports = RecruiterInterest;
