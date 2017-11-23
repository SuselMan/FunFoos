/**
 * Created by pavluhin on 01.03.2017.
 */


import Backbone from 'backbone';

const Division = Backbone.Model.extend({
  idAttribute: '_id',
  urlRoot: '/api/divisions',
  initialize(attrs, options) {
    this.options = options;
  },
  defaults: {
    rounds: 2,
    meetingStructure: [2, 2, 1, 1, 2, 2],
    subseason: null,
    penalty: false,
    season: null,
    maxScore: 5,
    maxGames: 2
  }
});

export default Backbone.Collection.extend({
  url: '/api/divisions',
  model: Division,
  name: ''
});
