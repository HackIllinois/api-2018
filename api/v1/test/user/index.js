var chai = require('chai');

describe('user tests', function() {
  it('should pass all user tests', function(done) {
    require('./staff');
    require('./hacker');
    done();
  });
});
