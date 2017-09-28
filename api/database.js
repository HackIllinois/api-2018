const config = require('./config');
const logger = require('./logging');

const milliseconds = require('ms');

const KNEX_CONFIG = {
  client: 'mysql',
  connection: {
    host: config.database.primary.host,
    port: config.database.primary.port,
    user: config.database.primary.user,
    password: config.database.primary.password,
    database: config.database.primary.name
  },
  pool: {
    min: config.database.primary.pool.min,
    max: config.database.primary.pool.max,
    idleTimeout: milliseconds(config.database.primary.pool.idleTimeout)
  }
};

function DatabaseManager() {
  logger.info('connecting to database');
  this._knex = require('knex')(KNEX_CONFIG);

  this._bookshelf = require('bookshelf')(this._knex);
  this._bookshelf.plugin('pagination');
}

DatabaseManager.prototype.constructor = DatabaseManager;

DatabaseManager.prototype.instance = function() {
  return this._bookshelf;
};

DatabaseManager.prototype.connection = function() {
  return this._knex;
};

module.exports = new DatabaseManager();
