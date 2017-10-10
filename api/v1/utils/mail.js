const _ = require('lodash');

function Mail(ctx) {
  let config = ctx.config();
  this.checkValidMailName = (listName) => !_.isUndefined(config.mail.lists[listName]);
  this.checkValidTemplateName = (templateName) => !_.isUndefined(config.mail.templates[templateName]);
}

Mail.prototype.constructor = Mail;
let mailService;

module.exports = function(ctx) {
  if(!mailService){
    mailService = new MailService(ctx);
  }
  return mailService;
}
