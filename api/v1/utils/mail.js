module.exports.templates = {};
module.exports.lists = {};

// mapping internal template identifiers to client template identifiers
module.exports.templates.test = 'test';
module.exports.templates.passwordReset = 'password_reset';
module.exports.templates.acceptance = 'acceptance';

// mapping internal list identifiers to internal-client representation
module.exports.lists.test = { name: 'test', id: 'test' };
module.exports.lists.idlers = { name: 'idlers', id: 'idlers-2017' };
module.exports.lists.applicants = { name: 'applicants', id: 'applicants-2017' };
module.exports.lists.lightningTalks = { name: 'lightning_talks', id: 'lightning-talks-2017' };
module.exports.lists.accepted = { name: 'accepted', id: 'accepted-2017' };
module.exports.lists.waitlisted = { name: 'waitlisted', id: 'waitlisted-2017' };
module.exports.lists.attendees = {name: 'attendees', id: 'attendees-2017'};
module.exports.lists.admins = { name: 'admins', id: 'admins-2017' };
module.exports.lists.staff = { name: 'staff', id: 'staff-2017' };
module.exports.lists.sponsors = { name: 'sponsors', id: 'sponsors-2017' };
module.exports.lists.mentors = { name: 'mentors', id: 'mentors-2017' };
module.exports.lists.volunteers = { name: 'volunteers', id: 'volunteers-2017' };

//mapping of applicant decision waves to mailing list name
module.exports.lists.wave1 = { name: 'wave_1', id: 'wave-1-2017' };
module.exports.lists.wave2 = { name: 'wave_2', id: 'wave-2-2017' };
module.exports.lists.wave3 = { name: 'wave_3', id: 'wave-3-2017' };
module.exports.lists.wave4 = { name: 'wave_4', id: 'wave-4-2017' };
module.exports.lists.wave5 = { name: 'wave_5', id: 'wave-5-2017' };
module.exports.lists.rejected = { name: 'rejected', id: 'rejected-2017'};
