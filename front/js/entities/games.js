/**
 * Created by ipavl on 15.06.2017.
 */

'use strict';

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

// TODO: move it out to separate ENUM file
const DOUBLE = 2;
const SINGLE = 1;

const Game = Backbone.Model.extend({
  idAttribute: "_id",
  urlRoot: '/api/games',

  initialize: function (attrs, options) {
    this.options = options;
  },

  saveChanges: function (model) {
    return fetch(this.urlRoot + '/' + this.id, {
      headers: {'Content-Type': 'application/json'},
      method: 'put',
      body: JSON.stringify(model)
    });
  },

  validate: function (attrs) {
    // TODO return errors if they exist
    return false;
  }


});

const Games = Backbone.Collection.extend({
  url: '/api/games',
  model: Game,
  protocolStructure: [DOUBLE, DOUBLE, SINGLE, SINGLE, DOUBLE, DOUBLE] // double, double, single, single;
});

export default Games;
