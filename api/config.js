var logger = require('./logging');

DEVELOPMENT_IDENTIFIER = 'development';
PRODUCTION_IDENTIFIER = 'production';

var environment = process.env.NODE_ENV;
var secret = process.env.HACKILLINOIS_SECRET;
var isDevelopment = environment === DEVELOPMENT_IDENTIFIER;
var isProduction = environment === PRODUCTION_IDENTIFIER;

if (!isProduction && !isDevelopment) {
	logger.error("an environment was not provided");
	logger.error("set NODE_ENV to '%s' or '%s'",
		DEVELOPMENT_IDENTIFIER, PRODUCTION_IDENTIFIER);

	process.exit(1);
}

if (secret) {
	if (isProduction) {
		logger.error("the secret was not provided");
		logger.error("set HACKILLINOIS_SECRET to a secure, random string");

		process.exit(1);
	}

	secret = 'NONE';
}

var config = {};
config.auth = {};
config.database = {};
config.database.primary = { pool: {} };

config.isDevelopment = isDevelopment;
config.secret = secret;
config.port = process.env.HACKILLINOIS_PORT || 8080;

config.auth.secret = config.secret;
config.auth.header = 'Authorization';
config.auth.expiration = '7d';

config.database.primary.host = process.env.RDS_HOSTNAME || process.env.LOCAL_MYSQL_HOST || '127.0.0.1';
config.database.primary.port = process.env.RDS_PORT || process.env.LOCAL_MYSQL_PORT || 3306;
config.database.primary.user = process.env.RDS_USERNAME || process.env.LOCAL_MYSQL_USER || 'root';
config.database.primary.password = process.env.RDS_PASSWORD || process.env.LOCAL_MYSQL_PASSWORD || '';
config.database.primary.name = process.env.RDS_DB_NAME || 'hackillinois-2017';
config.database.primary.pool.min = 0;
config.database.primary.pool.max = 7500;
config.database.primary.pool.idleTimeout = 5 * 1000; // in millseconds

logger.info("prepared environment for %s", environment);

module.exports = config;
