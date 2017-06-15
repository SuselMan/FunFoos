/**
 * Created by pavluhin on 24.04.2017.
 */
'use strict';

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

const Meeting = Backbone.Model.extend({
  idAttribute: "_id",
  urlRoot: '/api/meetings',

  initialize: function(attrs,options){
    this.options = options;
  },
  defaults: {
    owner  : null,
    date     : null,
    place  : null,
    host  : null,
    guest  : null
  },

  update:function(){
    return fetch('/api/meetings/'+this.id,{
      headers: { 'Content-Type': 'application/json' },
      method:'put',
      body:JSON.stringify(this.toJSON())
    });
  }
});

const Meetings = Backbone.Collection.extend({
  url: '/api/meetings',
  model: Meeting
});

export default Meetings;