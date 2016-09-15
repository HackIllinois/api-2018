var UserService = require('../services/UserService');
var _Promise = require('bluebird');

var User = require('../models/User');
var Token = require('../models/Token');

module.exports = {
        userAssertHelper: function(res) {
                res.should.have.status(200);
                res.body.data.should.be.a('object');

                var body = res.body.data;
                body.id.should.not.be.null;
                body.email.should.not.be.null;
        },

        /* Please don't use this function for anywhere other than tests */
        userDelete: function(userEmail) {
                var user_id;
                return UserService.findUserByEmail(userEmail)
                        .then(function(userModel) {
                                user_id = userModel.attributes.id;
                                /* Destroy references in order */
                                return Token.collection()
                                        .query({ where: { user_id: user_id }})
                                        .fetchOne({ withRelated: ['user'] })
                                        .then(function (tok) {
						if (tok == null) return;
                                                tok.destroy();
                                        })
                                        .then(function () {
                                                return userModel.destroy();
                                        });
                        });
        }
};
