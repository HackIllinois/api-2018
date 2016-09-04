var Bookshelf = require('bookshelf');
var Knex = require('knex');
var milliseconds = require('ms');

var logger = require('./logging');
var config = require('./config');

var KNEX_CONFIG = {
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
	this._knex = Knex(KNEX_CONFIG);
	this._bookshelf = Bookshelf(this._knex);
}

DatabaseManager.prototype.constructor = DatabaseManager;

DatabaseManager.prototype.instance = function () {
	return this._bookshelf;
};
DatabaseManager.prototype.connection = function () {
	return this._knex;
};

logger.info("connected to database as %s", config.database.primary.user);

module.exports = new DatabaseManager();
