const rateLimiter = require('express-rate-limit-middleware').rateLimit

const config = require('../../config');
const redisStorage = require('express-rate-limit-middleware').redisRateLimit
const redisClient = require('../../cache').instance();

module.exports = function(limitCount, resetTimer) {
	return (req, res, next) => {
		rateLimiter({
				limit: limitCount,
				reset: resetTimer,
				storageEngine: redisStorage(redisClient)
			})(req, res, next)
	};
};