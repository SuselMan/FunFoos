

import Backbone from 'backbone';

const User = Backbone.Model.extend({
  idAttribute: '_id',
  defaults: {
    email: '',
    password: '',
    team: []
  },

  initialize(attrs, options) {
    this.options = options;
  },

  update() {
    return fetch(`/api/user/${this.id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'put',
      body: JSON.stringify(this.toJSON())
    });
  },

  signin() {
    this.urlRoot = '/api/login';
    return this.save();
  },

  signup() {
    this.urlRoot = '/api/signup';
    return this.save();
  },

  updateSignin() {
    this.urlRoot = '/api/login';
    return this.fetch();
  },

  validate: (attrs) => {
    if (!attrs.email || !attrs.password) {
      return 'Все поля должны быть заполнены!';
    }
    return null;
  }
});

export default User;
