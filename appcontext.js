function AppContext() {
    this._config = require('./api/config');
    this._logger = require('./api/logging');
    this._database = require('./api/database'); // eslint-disable-line no-unused-vars
    this._cache  = require('./api/cache');
}

AppContext.prototype.constructor = AppContext;

AppContext.prototype.config = function() {
    return this._config;
};

AppContext.prototype.logger = function() {
    return this._logger;
};

AppContext.prototype.database = function() {
    return this._database;
};

AppContext.prototype.cache = function() {
    return this._cache;
};

module.exports = new AppContext();
