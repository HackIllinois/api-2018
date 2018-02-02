const Model = require('./Model');

const JobApplication = Model.extend({
  tableName: 'job_applications',
  hasTimestamps: ['created', 'updated'],
  validations: {
    appId: ['required', 'int'],
    recruiterId: ['required', 'int'],
    applicantId: ['required', 'int'],
    comments: ['string'],
    favorite: ['int']
  }
});

JobApplication.findById = (id) => JobApplication.where({
  app_id: id
})
  .fetch();

JobApplication.findByRecruiterId = (id) => JobApplication.where({
  recruiter_id: id
})
  .fetch();

JobApplication.findByApplicantId = (id) => JobApplication.where({
  applicant_id: id
})
  .fetch();

module.export = JobApplication;
