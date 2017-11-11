
const BruteLimiter = require('express-brute');
const RedisStore = require('express-brute-redis');

module.exports = (ctx) => {
    let cache = ctx.cache().instance();
    let config = ctx.config();

    let store = new RedisStore({
      client: cache
    });

    let ratelimiter = new BruteLimiter(store, {
      freeRetries: config.limit.count,
      attachResetToRequest: false,
      refreshTimeoutOnRequest: false,
      minWait: config.limit.window * 1000 + 1, // Set delay equal to just over the lifetime, * 1000 to convert to milliseconds
      maxWait: config.limit.window * 1000 + 1, // Set delay equal to just over the lifetime, * 1000 to convert to milliseconds
      lifetime: config.limit.window
    });

    return ratelimiter.prevent;
}
