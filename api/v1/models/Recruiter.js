const Model = require('./Model');

const Recruiter = Model.extend({
  tableName: 'recruit'
  hasTimestamps: ['created', 'updated'],
  validations: {
    id: ['required', 'int'],
    companyName: ['required', 'string']
  },
  jobApplicants: function() {
    return this.hasMany(UserRole);
  }
});

module.export = Recruiter;
