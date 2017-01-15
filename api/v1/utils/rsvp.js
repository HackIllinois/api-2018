var _ = require('lodash');
var ATTENDANCE_REPLY = ['YES', 'NO', 'YES_TO_CREATE'];

module.exports.verifyAttendanceReply = function(reply){
    if (!_.includes(ATTENDANCE_REPLY, reply)) {
        throw new TypeError(reply + " is not a valid attendance reply option");
    }

    return true;
}