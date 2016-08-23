module.exports = {
  userAssertHelper: function(res) {
    res.should.have.status(200);
    res.body.data.should.be.a('object');

    var body = res.body.data;
    body.id.should.not.be.null;
    body.email.should.not.be.null;
  }
};
