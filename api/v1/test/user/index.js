var chai = require('chai');

describe('/v1/user tests', function() {
        it('should pass all user tests', function(done) {
                require('./admin');
                require('./staff');
                require('./hacker');
                done();
        });
});
