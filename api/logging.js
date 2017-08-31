const winston = require('winston');

const config = require('./config');

const transports = [];
const consoleTransport = new winston.transports.Console({
  colorize: !config.isProduction,
  prettyPrint: !config.isProduction,
  stringify: config.isProduction,
  json: config.isProduction,
  level: 'debug'
});

// add other transports as needed
transports.push(consoleTransport);

const logger = new winston.Logger({
  transports: transports
});

module.exports = logger;
