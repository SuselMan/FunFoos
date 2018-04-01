/**
 * Created by pavluhin on 24.04.2017.
 */


import Backbone from 'backbone';

const Meeting = Backbone.Model.extend({
  idAttribute: '_id',
  urlRoot: '/api/meetings',

  initialize(attrs, options) {
    this.options = options;
  },
  defaults: {
    date: null,
    place: null,
    host: null,
    guest: null,
    owner: null, //owner is division
    score: null,
    penaltyScore: null,
    approved: false,
    winner: null,
  },

  update() {
    return fetch(`/api/meetings/${this.id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'put',
      body: JSON.stringify(this.toJSON())
    });
  }
});

const Meetings = Backbone.Collection.extend({
  url: '/api/meetings',
  model: Meeting
});

export default Meetings;
