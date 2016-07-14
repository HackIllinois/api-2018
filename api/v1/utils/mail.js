module.exports.templates = {};
module.exports.lists = {};

// mapping internal template identifiers to client template identifiers
module.exports.templates.test = 'test';

// mapping internal list identifiers to client list identifiers
module.exports.lists.test = 'test';
module.exports.lists.idlers = 'idlers-2017';
module.exports.lists.applicants = 'applicants-2017';
module.exports.lists.accepted = 'accepted-2017';
module.exports.lists.waitlisted = 'waitlisted-2017';
module.exports.lists.software = 'software-2017';
module.exports.lists.hardware = 'hardware-2017';
module.exports.lists.open_source = 'open-source-2017';
module.exports.lists.admins = 'admins-2017';
module.exports.lists.staff = 'staff-2017';
module.exports.lists.sponsors = 'sponsors-2017';
module.exports.lists.mentors = 'mentors-2017';
module.exports.lists.volunteers = 'volunteers-2017';

// expose all available internal list identifiers
for (var list in module.exports.lists) {
	module.exports[list + "_list"] = list;
}
