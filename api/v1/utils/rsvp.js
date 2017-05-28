var _ = require('lodash');
var ATTENDANCE_TYPES = ['CREATE', 'CONTRIBUTE'];

module.exports.verifyAttendanceReply = function(reply){
    if (!_.includes(ATTENDANCE_TYPES, reply)) {
        throw new TypeError(reply + ' is not a valid attendance reply option');
    }

    return true;
};