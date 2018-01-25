const Model = require('./Model');

const JobApplicant = Model.extend({
  tableName: 'job_applicants'
  hasTimestamps: ['created', 'updated'],
  validations: {
    attendee_id: ['required', 'int'],
    comments: ['string'],
    ratings: ['int']
  },
});

module.export = JobApplicant;
