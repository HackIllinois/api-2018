const Model = require('./Model');

const RecruiterInterest = Model.extend({
  tableName: 'recruiter_interests',
  hasTimestamps: ['created', 'updated'],
  idAttribute: 'app_id',
  validations: {
    recruiterId: ['required','integer'],
    attendeeId: ['required','integer'],
    comments: ['string'],
    favorite: ['integer']
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
    .save({comments:comments,favorite:favorite},{patch:true});


module.exports = RecruiterInterest;
