/**
 * Created by ipavl on 07.06.2017.
 */


import Backbone from 'backbone';

const Place = Backbone.Model.extend({
  idAttribute: '_id',
  initialize(attrs, options) {
    this.options = options;
  },
  defaults: {
    name: '',
    workTime: [],
    workDays: [],
    specialDays: null,
    image: '',
    address: '',
    link: '',
    comment: ''
  },

  update() {
    return fetch(`/api/places/${this.id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'put',
      body: JSON.stringify(this.toJSON())
    });
  }
});

const Places = Backbone.Collection.extend({
  url: '/api/places',
  model: Place
});

export default Places;
