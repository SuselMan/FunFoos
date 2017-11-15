/**
 * Created by pavluhin on 01.03.2017.
 */


import Backbone from 'backbone';

const Season = Backbone.Model.extend({
  idAttribute: '_id',
  urlRoot: '/api/seasons',
  initialize(attrs, options) {
    this.options = options;
  },
  defaults: {
    name: '',
    state: 0
  }
});

const Seasons = Backbone.Collection.extend({
  url: '/api/seasons',
  model: Season,
  meetingStructure: [],
  name: ''
});

export default Seasons;
