var logger = require('./logging');
var config = require('./config');
var bluebird = require('bluebird');


var redis = require('redis');
//Promisfy redis
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var client = redis.createClient();


client.on('error', function(err){
	logger.error("Error with redis: " + err);
});

client.on('connect', function(){
	logger.info("connected to redis server");
});

module.exports = client;