const cache = require('../../cache').instance();
const config = require('../../config');

const BruteLimiter = require('express-brute');

const RedisStore = require('express-brute-redis');
const store = new RedisStore({
  client: cache
});

const ratelimiter = new BruteLimiter(store, {
  freeRetries: config.limit.count,
  attachResetToRequest: false,
  refreshTimeoutOnRequest: false,
  lifetime: config.limit.window
});

module.exports = ratelimiter.prevent;
