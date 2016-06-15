var Bookshelf = require('bookshelf');
var Knex = require('knex');

// TODO move into global configuration (with debug option)
var MIN_CONNECTIONS = 0;
var MAX_CONNECTIONS = 7500; // NOTE this should match the CloudWatch alert
var IDLE_TIMEOUT_MILLISECONDS = 5 * 1000;
var KNEX_CONFIG = {
	client: 'mysql',
	connection: {
		host: process.env.RDS_HOSTNAME || process.env.LOCAL_MYSQL_HOST || '127.0.0.1',
		port: process.env.RDS_PORT || process.env.LOCAL_MYSQL_PORT || 3306,
		user: process.env.RDS_USERNAME || process.env.LOCAL_MYSQL_USER || 'root',
		password: process.env.RDS_PASSWORD || process.env.LOCAL_MYSQL_PASSWORD || '',
		database: process.env.RDS_DB_NAME || 'hackillinois-2017'
	},
	pool: {
		min: MIN_CONNECTIONS,
		max: MAX_CONNECTIONS,
		idleTimeout: IDLE_TIMEOUT_MILLISECONDS
	}
};

function DatabaseManager() {
	this._knex = Knex(KNEX_CONFIG);
	this._bookshelf = Bookshelf(this._knex);
}

DatabaseManager.prototype.constructor = DatabaseManager;
DatabaseManager.prototype.instance = function() {
	return this._bookshelf;
};

module.exports = new DatabaseManager();
