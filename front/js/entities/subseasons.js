/**
 * Created by pavluhin on 01.03.2017.
 */


import Backbone from 'backbone';

const Subseason = Backbone.Model.extend({
  idAttribute: '_id',
  urlRoot: '/api/subseasons',
  initialize(attrs, options) {
    this.options = options;
  },
  defaults: {
    city: '',
    season: null
  }
});

const Subseasons = Backbone.Collection.extend({
  url: '/api/subseasons',
  model: Subseason,
  meetingStructure: [],
  name: ''
});

export default Subseasons;
