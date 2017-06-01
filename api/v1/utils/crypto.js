/* jshint esversion: 6 */

const Sha = require('jssha');
const uuid = require('node-uuid');

const SHA_TYPE = 'SHA-256';
const SHA_INPUT_TYPE = 'TEXT';
const SHA_OUTPUT_TYPE = 'HEX';

/**
 * Provides a weak hash of the provided text
 * @param  {String} text the value to hash
 * @return {String} the hashed value
 */
module.exports.hashWeak = function (text) {
  const sha256 = new Sha(SHA_TYPE, SHA_INPUT_TYPE);
  sha256.update(text);

  return sha256.getHash(SHA_OUTPUT_TYPE);
};

module.exports.generatePassword = function () {
  return uuid.v4();
};

module.exports.generateResetToken = function (){
  return uuid.v4();
};
