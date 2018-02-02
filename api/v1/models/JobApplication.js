const Model = require('./Model');

const JobApplication = Model.extend({
  tableName: 'job_applications',
  hasTimestamps: ['created', 'updated'],
  idAttribute: 'app_id',
  validations: {
    recruiterId: ['required', 'integer'],
    applicantId: ['required', 'integer'],
    comments: ['string'],
    favorite: ['integer']
  }
});

JobApplication.findById = (id) => JobApplication.where({
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

module.exports = JobApplication;
