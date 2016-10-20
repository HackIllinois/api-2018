var UserService = require('../services/UserService');
var _Promise = require('bluebird');

var User = require('../models/User');
var Token = require('../models/Token');

const RANDOM_USER_LEN = 50;
const RANDOM_DOMAIN_LEN = 15;
const RANDOM_SUFFIX_LEN = 10;
const RANDOM_PWD_LEN = 15;

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
                                                if (tok == null)
                                                {
                                                        userModel.destroy();
                                                }
                                                else
                                                {
                                                        tok.destroy().then(function () {
                                                                return userModel.destroy();
                                                        });
                                                }
                                        });
                        });
        },

        userGenerate: function(prefix) {

                var user = {
                        'email': '',
                        'password': ''
                };

                user.email = randString(RANDOM_USER_LEN) + '@'
                        + randString(RANDOM_DOMAIN_LEN) + '.' + randString(RANDOM_SUFFIX_LEN);

                user.password = randString(RANDOM_PWD_LEN);

                if (prefix)
                {
                        user.email = prefix + user.email;
                        user.password = prefix + user.password;
                }

                return user;
        }
};


function randString(len) {
        const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var builder = '';
        for (var i=0; i < len; i++)
        {
                builder += alpha[Math.floor(Math.random() * alpha.length)];
        }
        return builder;
}
