var _Promise = require('bluebird');

var config = require('../../config');
var files = require('../../files');
var errors = require('../errors');
var Upload = require('../models/Upload');

var client = require('../../redisdb');


function _storeHash (key, keyValuePairs) {
	return client.hmsetAsync(key, keyValuePairs).then(function(reply){
		return reply;
	});
}

function _storeString(key, value) {
	return client.setAsync(key, value).then(function(reply){
		return reply;
	});
}

function _storeList() {
	return null;
}

module.exports.storeHash = function (key, keyValuePairs) {
	return _Promise.resolve(_storeHash(key, keyValuePairs));
}

module.exports.storeString = function (key, value) {
	return _Promise.resolve(_storeString(key, value));
}