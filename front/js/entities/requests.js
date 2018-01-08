/**
 * Created by pavluhin on 01.03.2017.
 */


import Backbone from 'backbone';

const Request = Backbone.Model.extend({
  idAttribute: '_id',
  urlRoot: '/api/requests',
  defaults: {
    type: '',
    body: null,
    target: null
  },

  initialize(attrs, options) {
    this.options = options;
  }
});

const Requests = Backbone.Collection.extend({
  url: '/api/requests',
  model: Request
});

export default Requests;
