var chai = require('chai');

describe('/v1/auth endpoint tests', function() {
        it('should pass all auth tests', function(done) {
                require('./staff');
                require('./hacker');
                require('./admin');
                done();
        });
});
