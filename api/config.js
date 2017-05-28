/* jshint esversion: 6 */
/* eslint-disable no-process-exit, no-console */

// NOTE: all durations are expressed using notation understood by the
// `ms` NPM module. These durations must be converted before they are used.

const DEVELOPMENT_IDENTIFIER = 'development';
const PRODUCTION_IDENTIFIER = 'production';
const TEST_IDENTIFIER = 'test';

var config = {};
config.auth = {};
config.aws = {
    defaults: {}
};
config.database = {};
config.redis = {};
config.database.primary = {
    pool: {}
};
config.mail = {};
config.logs = {};
config.storage = {};
config.superuser = {};
config.token = {
    expiration: {}
};

config.environment = process.env.NODE_ENV;
config.isProduction = (config.environment === PRODUCTION_IDENTIFIER);
config.isDevelopment = (config.environment === DEVELOPMENT_IDENTIFIER);
config.isTest = (config.environment === TEST_IDENTIFIER);
config.secret = process.env.HACKILLINOIS_SECRET;
config.port = process.env.HACKILLINOIS_PORT;

config.superuser.email = process.env.HACKILLINOIS_SUPERUSER_EMAIL;
config.superuser.password = process.env.HACKILLINOIS_SUPERUSER_PASSWORD;

config.auth.secret = config.secret;
config.auth.header = 'Authorization';
config.auth.expiration = '7d';

var sharedAWSCreds = new(require('aws-sdk')
  .SharedIniFileCredentials)();
config.aws.enabled = (process.env.AWS && !!parseInt(process.env.AWS));
config.aws.defaults.credentials = (sharedAWSCreds.accessKeyId) ? sharedAWSCreds : undefined;
config.aws.defaults.region = 'us-east-1';
config.aws.defaults.sslEnabled = true;

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

config.mail.key = process.env.HACKILLINOIS_MAIL_KEY;
config.mail.sinkhole = '.sink.sparkpostmail.com';
config.mail.whitelistedDomains = ['@hackillinois.org'];
config.mail.whitelistedLists = ['test'];

config.logs.streamPrefix = 'instances';
config.logs.groupName = (!config.isProduction) ? 'api-dev' : 'api';

config.storage.bucketExtension = (!config.isProduction) ? '-development' : '-2017';

var exit = true;
if (!(config.isProduction || config.isDevelopment || config.isTest)) {
    console.error("error: set NODE_ENV to '%s', '%s', or '%s'", PRODUCTION_IDENTIFIER, DEVELOPMENT_IDENTIFIER, TEST_IDENTIFIER);
} else if (!config.superuser.email) {
    console.error("error: set configuration key 'HACKILLINOIS_SUPERUSER_EMAIL' to the desired admin email");
} else if (!config.superuser.password) {
    console.error("error: set configuration key 'HACKILLINOIS_SUPERUSER_PASSWORD' to a secure, random string");
} else if (!config.secret) {
    console.error("error: set configuration key 'HACKILLINOIS_SECRET' to a secure, random string");
} else if (config.isProduction && !config.mail.key) {
    console.error("error: set configuration key 'HACKILLINOIS_MAIL_KEY' to the mailing provider's API key");
} else {
    exit = false;
}
if (exit) {
    console.error('fatal: environment incomplete. shutting down...');
    process.exit();
}

module.exports = config;
