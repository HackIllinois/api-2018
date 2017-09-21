const _ = require('lodash');
const config = require('../../config');

module.exports.checkValidMailName = (listName) => !_.isUndefined(config.mail.lists[listName]);
module.exports.checkValidTemplateName = (templateName) => !_.isUndefined(config.mail.templates[templateName]);
