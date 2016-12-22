var chai = require('chai');
chai.use(require('chai-as-promised'));

var mockery = require('mockery');
var mockknex = require('mock-knex');
var bookshelf = require('bookshelf');
function bookshelfMock (knex) {
	mockknex.mock(knex);
	return bookshelf(knex);
}

mockery.registerMock('bookshelf', bookshelfMock);
mockery.registerMock('redis', require('redis-mock'));

mockery.enable({ warnOnUnregistered: false });

require('./user.js');
require('./auth.js');
require('./permission.js');
require('./token.js');
require('./storage.js');

mockery.disable();
