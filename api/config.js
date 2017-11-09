/* jshint esversion: 6 */
/* eslint-disable no-process-exit, no-console */
const _ = require('lodash');

function handleEnvironmentIncomplete () {
  console.error('fatal: environment incomplete. shutting down...');
  process.exit();
}

function handleEnvironmentLoad () {
  const environment = process.env.NODE_ENV;
  const path = '../config/' + environment;

  try {
    require.resolve(path);
  } catch (e) {
    console.error('error: no configuration found for environment \'%s\'', environment);
    handleEnvironmentIncomplete();
  }

  return require(path);
}

function handleEnvironmentOverrides (config, overrides) {
  _.forEach(overrides, (configKey, envKey) => {
    if (!_.isUndefined(process.env[envKey])) {
      let overrideValue = process.env[envKey];
      if (envKey === 'AWS') {
        overrideValue = !!overrideValue;
      }
      if (envKey === 'PORT' || envKey === 'DB_PORT' || envKey === 'REDIS_PORT') {
        overrideValue = parseInt(overrideValue);
      }

      _.set(config, configKey, overrideValue);
    }
  });
}

function handleEnvironmentRequireds (config, requireds) {
  let incomplete = false;
  requireds.forEach((requiredKey) => {
    if (_.isNil(_.get(config, requiredKey))) {
      incomplete = true;
      console.error('error: configuration key %s was null or undefined. it should set or overriden', requiredKey);
    }
  });

  if (incomplete) {
    handleEnvironmentIncomplete();
  }
}

function handleAWSOverrides (config) {
  const sharedAWSCreds = new (require('aws-sdk').SharedIniFileCredentials)();
  config.aws.defaults.credentials = (sharedAWSCreds.accessKeyId) ? sharedAWSCreds : undefined;

  if (config.aws.enabled && _.isUndefined(config.aws.defaults.credentials)) {
    console.error('error: unable to retrieve AWS credentials, but AWS access was enabled');
  }
}

const config = handleEnvironmentLoad();

const overrides = {};
overrides['AWS'] = 'aws.enabled';
overrides['SECRET'] = 'auth.secret';
overrides['PORT'] = 'port';
overrides['SUPERUSER_EMAIL'] = 'superuser.email';
overrides['SUPERUSER_PASSWORD'] = 'superuser.password';
overrides['MAIL_KEY'] = 'mail.key';
overrides['GITHUB_CLIENT_ID'] = 'auth.github.id';
overrides['GITHUB_CLIENT_SECRET'] = 'auth.github.secret';
overrides['DB_NAME'] = 'database.primary.name';
overrides['DB_USERNAME'] = 'database.primary.user';
overrides['DB_PASSWORD'] = 'database.primary.password';
overrides['DB_HOSTNAME'] = 'database.primary.host';
overrides['DB_PORT'] = 'database.primary.port';
overrides['REDIS_HOST'] = 'redis.host';
overrides['REDIS_PORT'] = 'redis.port';
overrides['RATELIMIT_COUNT'] = 'limit.count';
overrides['RATELIMIT_WINDOW'] = 'limit.window';
handleEnvironmentOverrides(config, overrides);
handleAWSOverrides(config);

const requireds = new Set(_.values(overrides));
if (!config.isProduction) {
  requireds.delete(overrides['MAIL_KEY']);
  requireds.delete(overrides['GITHUB_CLIENT_ID']);
  requireds.delete(overrides['GITHUB_CLIENT_SECRET']);
  requireds.delete(overrides['RATELIMIT_COUNT']);
  requireds.delete(overrides['RATELIMIT_WINDOW']);
}
handleEnvironmentRequireds(config, requireds);

module.exports = config;
