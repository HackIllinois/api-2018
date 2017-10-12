const express = require('express');
const requid = require('cuid');
const helmet = require('helmet');

const ctx = require('./ctx');
const config = ctx.config();
const logger = ctx.logger();

// the dirname is local to every module, so we expose the app root's cwd
// here (before initializing the api)
config.cwd = process.__dirname;

const instance = express();
instance.use(helmet());
instance.use((req, res, next) => {
  req.id = requid();
  next();
});

const api = require('./api/')(ctx);
instance.use('/v1', api.v1);

instance.listen(config.port, () => {
  logger.info('initialized api (http://localhost:%d)', config.port);
});
