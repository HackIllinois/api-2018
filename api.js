let express = require('express');
let requid = require('cuid');
let helmet = require('helmet');

let config = require('./api/config');
let database = require('./api/database'); // eslint-disable-line no-unused-vars
let logger = require('./api/logging');

// the dirname is local to every module, so we expose the app root's cwd
// here (before initializing the api)
config.cwd = process.__dirname;

let instance = express();
instance.use(helmet());
instance.use((req, res, next) => {
    req.id = requid();
    next();
});

let api = require('./api/');
instance.use('/v1', api.v1);

instance.listen(config.port, () => {
    logger.info('initialized api (http://localhost:%d)', config.port);
});
