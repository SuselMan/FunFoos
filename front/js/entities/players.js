/**
 * Created by pavluhin on 01.03.2017.
 */


import Backbone from 'backbone';

const Player = Backbone.Model.extend({
  idAttribute: '_id',
  initialize(attrs, options) {
    this.options = options;
  },
  defaults: {
    firstName: '',
    secondName: '',
    owner: null,
    image: ''
  },

  update() {
    return fetch(`/api/players/${this.id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'put',
      body: JSON.stringify(this.toJSON())
    });
  }
});

const Players = Backbone.Collection.extend({
  url: '/api/players',
  model: Player,
  comparator (item){
    return -1 * item.get('winRate');
  }
});

export default Players;
