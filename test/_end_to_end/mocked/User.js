var mockery = require('mockery');
var _Promise = require('bluebird');

var MockedUserDataStore = [];

function MockedUserModel(email, password, role) {
    return {
        tableName: 'users',
        idAttribute: 'id',
        attributes: {
            id: MockedUserDataStore.length+1,
            roles: role,
            email: email,
            password: password,
            created: 0.0,
            updated: 0.0
        },

        destroy: function() {
            /* Implement destroy */
            for (var i = 0; i < MockedUserDataStore.length; i++)
            {
                if (MockedUserDataStore[i].attributes.id == this.attributes.id)
                    break;
            }

            if (MockedUserDataStore[i].attributes.id != this.attributes.id)
            {
                // No user was found
                return;
            }

            MockedUserDataStore = MockedUserDataStore.splice(i, 1);
        },

        save: function () {
            MockedUserDataStore.push(this);
        },

        setPassword: function (password) {
            this.attributes.password = password;
        },

        getRole: function (role) {
            /* Todo: implement mock getRole function */
            // return _.find(this.related('roles').models, function (role) {
            //     return role.role === role;
            // });
        },

        hasRole: function (role, activeOnly) {
            /* Todo: implement mock hasRole function */
            // if (_.isUndefined(this.related('roles'))) {
            //     throw new TypeError("The related roles were not fetched with this User");
            // }

            // var roleMatch = { role: role };
            // if (_.isUndefined(activeOnly) || activeOnly) {
            //     role.active = 1;
            // }

            // return _.some(this.related('roles').toJSON(), roleMatch);
        },

        hasRoles: function (roles, activeOnly) {
            /* Todo: implement mock getRoles function */
            var found = false;
            _.forEach(roles, _.bind(function (role) {
                found = found || this.hasRole(role, activeOnly);
            }, this));

            return found;
        },

        hasPassword: function(password) {
            return this.attributes.password == password;
        },

        serialize: function () {
            var serialized = _.omit(this.attributes, ['password']);

            var roles = this.related('roles');
            serialized.roles = (_.isUndefined(roles)) ? null : roles.serialize();

            return serialized;
        }
    };
};

var MockedUser = {
    findById: function (id) {
        for (var i = 0; i < MockedUserDataStore.length; i++)
        {
            if (MockedUserDataStore[i].attributes.id == id)
                return _Promise.resolve(MockedUserDataStore[i]);
        }

        return _Promise.resolve(null);
    },

    findByEmail: function(email) {
        for (var i = 0; i < MockedUserDataStore.length; i++)
        {
            if (MockedUserDataStore[i].attributes.email == email)
                return _Promise.resolve(MockedUserDataStore[i]);
        }

        return _Promise.resolve(null);
    },

    create: function(email, password, role) {
        var model = MockedUserModel(email, password, role);
        return model;
    }
};

mockery.registerMock('../models/User', MockedUser);
