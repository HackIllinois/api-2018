const express = require('express');
const requid = require('cuid');
const helmet = require('helmet');

const config = require('./api/config');
const database = require('./api/database'); // eslint-disable-line no-unused-vars
const logger = require('./api/logging');

// the dirname is local to every module, so we expose the app root's cwd
// here (before initializing the api)
config.cwd = process.__dirname;

const instance = express();
instance.use(helmet());
instance.use((req, res, next) => {
  req.id = requid();
  next();
});

const api = require('./api/');
instance.use('/v1', api.v1);

instance.listen(config.port, () => {
  logger.info('initialized api (http://localhost:%d)', config.port);
});
