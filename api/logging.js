const winston = require('winston');

const config = require('./config');

const transports = [];
const consoleTransport = new winston.transports.Console({
  colorize: !config.isProduction,
  prettyPrint: !config.isProduction,
  stringify: config.isProduction,
  json: config.isProduction
});

// add other transports as needed
transports.push(consoleTransport);

const logger = new winston.Logger({
  transports: transports
});
logger.info('prepared environment for %s', config.environment);

module.exports = logger;
