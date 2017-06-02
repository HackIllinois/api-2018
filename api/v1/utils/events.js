const _ = require('lodash');
const ALL_TAGS = ['PRE_EVENT', 'POST_EVENT'];

module.exports.verifyTag = (tag) => {
  if (!_.includes(ALL_TAGS, tag)) {
    throw new TypeError(tag + ' is not a valid event tag');
  }

  return true;
};
