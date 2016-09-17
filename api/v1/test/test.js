require('./user');
require('./auth');

/* Purge data base after last test */
after(function(done) {
	console.log('finished all tests');
	done();
});
