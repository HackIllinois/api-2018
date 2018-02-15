/* jshint esversion: 6 */

const MILLISECONDS_PER_SECOND = 1000;

const milliseconds = require('ms');

module.exports.unix = () => Math.floor(Date.now() / MILLISECONDS_PER_SECOND);

module.exports.toMilliseconds = (description) => milliseconds(description);

module.exports.secondsToHHMMSS = (numSeconds) => {
  numSeconds = Number(numSeconds);
  const h = Math.floor(numSeconds / 3600);
  const m = Math.floor(numSeconds % 3600 / 60);
  const s = Math.floor(numSeconds % 3600 % 60);
  return ((h > 0 ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (s < 10 ? '0' : '') + s);
};

module.exports.convertISOTimeToMySQLTime = (isotime) => new Date(isotime).toISOString().substring(0, 19).replace('T', ' ');
