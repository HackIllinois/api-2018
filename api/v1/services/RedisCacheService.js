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

function _storeString (key, value) {
	return client.setAsync(key, value).then(function(reply){
		return reply;
	});
}

function _storeList (key, values) {
	return client.rpushAsync(key, values).then(function(reply){
		return reply;
	});
}

function _getString (key) {
	return client.getAsync(key).then(function(res){
		return res;
	});
}

function _getList (key, startIndex, endIndex) {
	return client.lrangeAsync(key, startIndex, endIndex).then(function(res){
		return res;
	});
} 

function _stringKeyExists (key) {
	return client.existsAsync(key)
		.then(function(reply){
			if(reply != 1){
				//TODO: Create new error for non-existent keys
				throw new errors.ApiError();
			}else{
				return _getString(key);
			}
		});
}

function _listKeyExists (key, startIndex, endIndex) {
	return client.existsAsync(key)
		.then(function(reply){
			if(reply != 1){
				//TODO: Create new error for non-existent keys
				throw new errors.ApiError();
			}else{
				return _getList(key, startIndex, endIndex)
			}
		});
}

module.exports.storeHash = function (key, keyValuePairs) {
	return _Promise.resolve(_storeHash(key, keyValuePairs));
}

module.exports.storeString = function (key, value) {
	return _Promise.resolve(_storeString(key, value));
}

module.exports.storeList = function (key, values) {
	return _Promise.resolve(_storeList(key, values));
}

module.exports.getString = function (key) {
	return _Promise.resolve(_stringKeyExists(key));
}

module.exports.getList = function (key, startIndex, endIndex) {
	return _Promise.resolve(_listKeyExists(key, startIndex, endIndex));
}
