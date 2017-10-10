module.exports = {
  crypto: require('./crypto.js'),
  cache: require('./cache.js')(),
  database: require('./database.js'),
  errors: require('./errors.js'),
  logs: require('./logs.js')(),
  mail: require('./mail.js'),
  roles: require('./roles.js'),
  scopes: require('./scopes.js'),
  storage: require('./storage.js')(),
  time: require('./time.js'),
  validators: require('./validators.js')
};
