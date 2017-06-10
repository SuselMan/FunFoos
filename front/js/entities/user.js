'use strict';

import Backbone from 'backbone';

const User = Backbone.Model.extend({
    idAttribute: "_id",
    defaults: {
        "email": "",
        "password": "",
        "team": []
    },

    initialize: function (attrs, options) {
        this.options = options;
    },

    update: function () {
        return fetch('/api/user/' + this.id, {
            headers: {'Content-Type': 'application/json'},
            method: 'put',
            body: JSON.stringify(this.toJSON())
        });
    },

    signin: function () {
        this.urlRoot = '/api/login';
        return this.save();
    },

    signup: function () {
        this.urlRoot = '/api/signup';
        return this.save();
    },

    updateSignin: function () {
        this.urlRoot = '/api/login';
        return this.fetch();
    },

    validate: (attrs, options)=> {
        if (!attrs.email || !attrs.password) {
            return 'Все поля должны быть заполнены!'
        }
    }
});

export default User;