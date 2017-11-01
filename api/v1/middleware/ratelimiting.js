const rateLimiter = require('express-rate-limit-middleware').rateLimit

const config = require('../../config');
const redisStorage = require('express-rate-limit-middleware').redisRateLimit
const redisClient = require('../../cache').instance();

module.exports = (req, res, next) => {
	rateLimiter({
			limit: 10,
			reset: '1 hour',
			storageEngine: redisStorage(redisClient)
		})(req, res, next)
};