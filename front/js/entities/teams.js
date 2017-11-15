/**
 * Created by pavluhin on 28.02.2017.
 */


import Backbone from 'backbone';

const Team = Backbone.Model.extend({
  idAttribute: '_id',
  urlRoot: '/api/teams',

  defaults: {
    name: '',
    shortName: '',
    image: '',
    season: null
  },

  initialize(attrs, options) {
    this.options = options;
  },

  update() {
    return fetch(`/api/teams/${this.id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'put',
      body: JSON.stringify(this.toJSON())
    });
  }
});

const Teams = Backbone.Collection.extend({
  url: '/api/teams',
  model: Team
});

export default Teams;
