var Sha = require('jssha');

var SHA_TYPE = "SHA-256";
var SHA_INPUT_TYPE = "TEXT";
var SHA_OUTPUT_TYPE = "HEX";

var DEFAULT_PASSWORD_LENGTH = 33;

/**
 * Provides a weak hash of the provided text
 * @param  {String} text the value to hash
 * @return {String} the hashed value
 */
module.exports.hashWeak = function (text) {
	var sha256 = new Sha(SHA_TYPE, SHA_INPUT_TYPE);
	sha256.update(text);

	return sha256.getHash(SHA_OUTPUT_TYPE);
};

/**
 * Generates a pseudo-random string
 * @return {String} a significantly-long, pseudo-random string
 */
module.exports.generatePassword = function () {
	return Math.random().toString(DEFAULT_PASSWORD_LENGTH).slice(2);
};
