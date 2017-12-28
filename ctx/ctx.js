function Ctx() {
    //relative to hackillinois/api/node_modules/ctx
    this._config = require('../../api/config');
    this._logger = require('../../api/logging');
    this._database = require('../../api/database');
    this._cache  = require('../../api/cache');
}

Ctx.prototype.constructor = Ctx;

Ctx.prototype.config = function() {
    return this._config;
};

Ctx.prototype.logger = function() {
    return this._logger;
};

Ctx.prototype.database = function() {
    return this._database;
};

Ctx.prototype.cache = function() {
    return this._cache;
};

module.exports = new Ctx();
