var Model = require('./Model');
var Upload = Model.extend({
	tableName: 'uploads',
	idAttribute: 'id'
});

module.exports = Upload;
