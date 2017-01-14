var _ = require('lodash');

var ALL_RESPONSES = ['YES', 'NO', 'YESTOCREATE'];

_.forEach(ALL_RESPONSES, function (response) {
    module.exports[response] = response;
});

/**
 * Ensures that the provided response is in ALL_RESPONSES
 * @param  {String} response the value to check
 * @return {Boolean} true when the response is valid
 * @throws TypeError when the response is invalid
 */
module.exports.verifyResponse = function (response) {
    if (!module.exports.isIn(ALL_RESPONSES, response)) {
        throw new TypeError(response + " is not a valid role");
    }

    return true;
};
