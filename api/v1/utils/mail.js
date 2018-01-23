const _ = require('lodash');
const ctx = require('ctx');
const config = ctx.config();

module.exports.checkValidMailName = (listName) => !_.isUndefined(config.mail.lists[listName]);
module.exports.checkValidTemplateName = (templateName) => !_.isUndefined(config.mail.templates[templateName]);
