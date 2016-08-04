/* jshint esversion: 6 */

var Sha = require('jssha');

const SHA_TYPE = "SHA-256";
const SHA_INPUT_TYPE = "TEXT";
const SHA_OUTPUT_TYPE = "HEX";

const PASSWORD_RADIX = 31;
const PASSWORD_LENGTH = 33;
const TOKEN_LENGTH = 33;

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
	return createRandomString(PASSWORD_LENGTH);
};

// TODO: Determine the length of the token
module.exports.generateResetToken = function (){
	return createRandomString(TOKEN_LENGTH);
};

function createRandomString(length){
	return Math.random().toString(PASSWORD_RADIX).substring(0, length);
}
