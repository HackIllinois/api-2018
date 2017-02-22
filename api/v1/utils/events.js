var _ = require('lodash');
var ALL_TAGS = ['HACKATHON', 'SCHEDULE'];

module.exports.verifyTag = function(tag){
    if (!_.includes(ALL_TAGS, tag)) {
        throw new TypeError(tag + " is not a valid event tag");
    }

    return true;
}