const Model = require('./Model');

const JobApplication = Model.extend({
  tableName: 'job_applications',
  hasTimestamps: ['created', 'updated'],
  idAttribute: 'app_id',
  validations: {
    recruiterId: ['integer'],
    applicantId: ['integer'],
    comments: ['string'],
    favorite: ['integer']
  }
});

JobApplication.findByApplicationId = (id) => JobApplication.where({
  app_id: id
})
  .fetch();

JobApplication.findByRecruiterId = (id) => JobApplication.where({
  recruiter_id: id
})
  .fetchAll();

JobApplication.findByApplicantId = (id) => JobApplication.where({
  applicant_id: id
})
  .fetchAll();

JobApplication.updateApplication = (appId, comments, favorite) => JobApplication
    .where({app_id: appId})
    .save({comments:comments,favorite:favorite},{patch:true});


module.exports = JobApplication;
