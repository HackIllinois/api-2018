const chai = require('chai');

const errors = require('../api/v1/errors');
const utils = require('../api/v1/utils');
const PermissionService = require('../api/v1/services/PermissionService.js');
const User = require('../api/v1/models/User.js');

const expect = chai.expect;

const test_allow = function(creatorRole, createdRole, success, done){
	const testUser = User.forge({ id: 1, email: 'new@example.com' });
	testUser.setPassword('password123').then(() => {
		testUser.related('roles').add({ role: creatorRole});
		const allow = PermissionService.canCreateUser(testUser,createdRole);
		if(success)
			expect(allow).to.eventually.equal(true).and.notify(done);
		else
            expect(allow).to.eventually.be.rejectedWith(errors.UnauthorizedError).and.notify(done);
	});
};

describe('PermissionService', () => {
	describe('canCreateUser', () => {
		it('allows creation by SUPERUSER', (done) => {
			test_allow(utils.roles.SUPERUSER,'',true,done);
		});
		it('allows creation of COMMON by ORGANIZER', (done) => {
			test_allow('ADMIN','MENTOR',true,done);
		});
		it('denies creation of COMMON by non-ORGANIZER', (done) => {
			test_allow('MENTOR','MENTOR',false,done);
		});
	});
});
