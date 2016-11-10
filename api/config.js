/* jshint esversion: 6 */

// NOTE: all durations are expressed using notation understood by the
// `ms` NPM module. These durations must be converted before they are used.

var logger = require('./logging');

const DEVELOPMENT_IDENTIFIER = 'development';
const PRODUCTION_IDENTIFIER = 'production';

var environment = process.env.NODE_ENV;
var secret = process.env.HACKILLINOIS_SECRET || undefined;
var superuserEmail = process.env.HACKILLINOIS_SUPERUSER_EMAIL || undefined;
var superuserPassword = process.env.HACKILLINOIS_SUPERUSER_PASSWORD || undefined;
var mailApiKey = process.env.HACKILLINOIS_MAIL_KEY || undefined;
var isDevelopment = environment === DEVELOPMENT_IDENTIFIER;
var isProduction = environment === PRODUCTION_IDENTIFIER;

if (!isProduction && !isDevelopment) {
	logger.error("an environment was not provided");
	logger.error("set NODE_ENV to '%s' or '%s'",
		DEVELOPMENT_IDENTIFIER, PRODUCTION_IDENTIFIER);

	process.exit(1);
}

if (!superuserEmail) {
	logger.error("set configuration key 'HACKILLINOIS_SUPERUSER_EMAIL' to the desired admin email");
	process.exit(1);
}

if (!superuserPassword) {
	logger.error("set configuration key 'HACKILLINOIS_SUPERUSER_PASSWORD' to a secure, random string");
	process.exit(1);
}

if (!secret) {
	logger.error("set configuration key 'HACKILLINOIS_SECRET' to a secure, random string");
	process.exit(1);
}

if (isProduction && !mailApiKey) {
	logger.error("set configuration key 'HACKILLINOIS_MAIL_KEY' to the mailing provider's API key");
	process.exit(1);
}

var config = {};
config.auth = {};
config.database = {};
config.redis = {};
config.database.primary = { pool: {} };
config.mail = {};
config.storage = {};
config.superuser = {};
config.token = { expiration: {} };

config.isDevelopment = isDevelopment;
config.secret = secret;
config.port = process.env.HACKILLINOIS_PORT;
config.profile = process.env.PROFILE;

config.superuser.email = superuserEmail;
config.superuser.password = superuserPassword;

config.auth.secret = config.secret;
config.auth.header = 'Authorization';
config.auth.expiration = '7d';

config.token.expiration.DEFAULT = '7d';
config.token.expiration.AUTH = config.token.expiration.DEFAULT;

config.database.primary.host = process.env.DB_HOSTNAME;
config.database.primary.port = process.env.DB_PORT;
config.database.primary.user = process.env.DB_USERNAME;
config.database.primary.password = process.env.DB_PASSWORD;
config.database.primary.name = process.env.DB_NAME;
config.database.primary.pool.min = 0;
config.database.primary.pool.max = 7500;
config.database.primary.pool.idleTimeout = '5s';

config.redis.host = process.env.REDIS_HOST;
config.redis.port = process.env.REDIS_PORT;
config.redis.path = process.env.REDIS_PATH;
config.redis.url = process.env.REDIS_URL;

config.mail.key = mailApiKey;
config.mail.sinkhole = '.sink.sparkpostmail.com';
config.mail.whitelistedDomains = ['@hackillinois.org'];
config.mail.whitelistedLists = ['test'];

config.storage.bucketExtension = (isDevelopment) ? '-development' : '-2017';

logger.info("prepared environment for %s", environment);

module.exports = config;
