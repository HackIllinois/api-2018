const Model = require('./Model');

const JobApplicant = Model.extend({
  tableName: 'job_applicants',
  hasTimestamps: ['created', 'updated'],
  validations: {
    appId: ['required', 'int'],
    recruiterId: ['required', 'int'],
    applicantId: ['required', 'int'],
    comments: ['string'],
    favorite: ['int']
  }
});

JobApplicant.findById = (id) => JobApplicant.where({
  app_id: id
})
  .fetch();

JobApplicant.findByRecruiterId = (id) => JobApplicant.where({
  recruiter_id: id
})
  .fetch();

JobApplicant.findByApplicantId = (id) => JobApplicant.where({
  applicant_id: id
})
  .fetch();

module.export = JobApplicant;
