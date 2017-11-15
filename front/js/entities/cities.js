/**
 * Created by pavluhin on 28.02.2017.
 */


import Backbone from 'backbone';

const City = Backbone.Model.extend({
  idAttribute: '_id',
  urlRoot: '/api/cities',

  defaults: {
    name: '',
    image: ''
  },

  initialize(attrs, options) {
    this.options = options;
  }
});

const Cities = Backbone.Collection.extend({
  url: '/api/cities',
  model: City
});

export default Cities;
