/* jshint esversion: 6 */

// NOTE: all duration are expressed using notation understood by the
// `ms` NPM module. These durations must be converted before they are used.

var logger = require('./logging');

const DEVELOPMENT_IDENTIFIER = 'development';
const PRODUCTION_IDENTIFIER = 'production';

var environment = process.env.NODE_ENV;
var secret = process.env.HACKILLINOIS_SECRET;
var superuserEmail = process.env.HACKILLINOIS_SUPERUSER_EMAIL;
var superuserPassword = process.env.HACKILLINOIS_SUPERUSER_PASSWORD;
var mailApiKey = process.env.HACKILLINOIS_MAIL_KEY;
var isDevelopment = environment === DEVELOPMENT_IDENTIFIER;
var isProduction = environment === PRODUCTION_IDENTIFIER;

if (!isProduction && !isDevelopment) {
	logger.error("an environment was not provided");
	logger.error("set NODE_ENV to '%s' or '%s'",
		DEVELOPMENT_IDENTIFIER, PRODUCTION_IDENTIFIER);

	process.exit(1);
}

if (!secret) {
	if (isProduction) {
		logger.error("set ENV variable HACKILLINOIS_SECRET to a secure, random string");
		process.exit(1);
	}

	secret = 'NONE';
}

if (!mailApiKey) {
	if (isProduction) {
		logger.error("set ENV variable HACKILLINOIS_MAIL_KEY to the mailing provider's API key");
		process.exit(1);
	}

	mailApiKey = undefined;
}

if (!superuserEmail) {
	if (isProduction) {
		logger.error("set ENV variable HACKILLINOIS_SUPERUSER_EMAIL to the desired admin email");
		process.exit(1);
	}

	superuserEmail = 'admin@example.com';
}

if (!superuserPassword) {
	if (isProduction) {
		logger.error("set ENV variable HACKILLINOIS_SUPERUSER_PASSWORD to a secure, random string");
		process.exit(1);
	}

	superuserPassword = 'ABCD1234!';
}

var config = {};
config.auth = {};
config.database = {};
config.database.primary = { pool: {} };
config.mail = {};
config.storage = {};
config.superuser = {};
config.token = { expiration: {} };

config.isDevelopment = isDevelopment;
config.secret = secret;
config.port = process.env.HACKILLINOIS_PORT || 8080;
config.profile = 'hackillinois-api';

config.domain = isDevelopment ? ('http://localhost:' + config.port) : 'https://hackillinois.org';

config.superuser.email = superuserEmail;
config.superuser.password = superuserPassword;

config.auth.secret = config.secret;
config.auth.header = 'Authorization';
config.auth.expiration = '7d';

config.token.expiration.DEFAULT = '7d';
config.token.expiration.AUTH = config.token.expiration.DEFAULT;

config.database.primary.host = process.env.RDS_HOSTNAME || process.env.LOCAL_MYSQL_HOST || '127.0.0.1';
config.database.primary.port = process.env.RDS_PORT || process.env.LOCAL_MYSQL_PORT || 3306;
config.database.primary.user = process.env.RDS_USERNAME || process.env.LOCAL_MYSQL_USER || 'root';
config.database.primary.password = process.env.RDS_PASSWORD || process.env.LOCAL_MYSQL_PASSWORD || '';
config.database.primary.name = process.env.RDS_DB_NAME || 'hackillinois-2017';
config.database.primary.pool.min = 0;
config.database.primary.pool.max = 7500;
config.database.primary.pool.idleTimeout = '5s';

config.mail.key = mailApiKey;
config.mail.sinkhole = '.sink.sparkpostmail.com';
config.mail.whitelistedDomains = ['@hackillinois.org'];
config.mail.whitelistedLists = ['test'];

config.storage.bucketExtension = (isDevelopment) ? '-development' : '-2017';

logger.info("prepared environment for %s", environment);

module.exports = config;
