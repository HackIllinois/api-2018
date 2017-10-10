const express = require('express');
const requid = require('cuid');
const helmet = require('helmet');

const ctx = require('./ctx');
const config = ctx.config();
const logger = ctx.logger();

require("./api/v1/utils/cache")(ctx);
require("./api/v1/utils/logs")(ctx);
require("./api/v1/utils/mail")(ctx);
require("./api/v1/utils/storage")(ctx);

require("./api/v1/middleware/auth")(ctx);

require("./api/v1/services/AuthService")(ctx);
require("./api/v1/services/MailService")(ctx);
require("./api/v1/services/StatsService")(ctx);
require("./api/v1/services/StorageService")(ctx);
require("./api/v1/services/TokenService")(ctx);
require("./api/v1/services/TrackingService")(ctx);




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
