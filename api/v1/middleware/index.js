const ctx = require("../../../ctx");
module.exports = {
  auth: require('./auth.js')(ctx),
  errors: require('./errors.js'),
  permission: require('./permission.js'),
  response: require('./response.js'),
  request: require('./request.js'),
  upload: require('./upload.js'),
  ratelimiting: require('./ratelimiting.js')(ctx)
};
