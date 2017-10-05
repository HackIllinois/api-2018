/* jshint esversion: 6 */

const uuid4 = require('uuid/v4');

module.exports.generatePassword = () => uuid4();
module.exports.generateResetToken = () => uuid4();
