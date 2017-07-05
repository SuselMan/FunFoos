/**
 * Created by ipavl on 14.06.2017.
 */

"use strict";

import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Games from '../../entities/games'
import Players from '../../entities/players'
import dataSelector from '../../widgets/dataSelector/dataSelector';

let channelGlobal = Radio.channel('global');

const GameView = Marionette.View.extend({
  template: require('../../../templates/meeting/game.hbs'),
  className: 'game',
  regions: {
    host0: '.js-firstHost',
    host1: '.js-secondHost',
    guest0: '.js-firstGuest',
    guest1: '.js-secondGuest'
  },

  initialize: function (options) {
    this.options = options;
  },

  onRender: function () {
    let type = this.model.get('type');
    let hostSelectors = [];
    let guestSelectors = [];
    for (var i = 0; i < type; i++){
      hostSelectors.push(new dataSelector({data: this.options.hostPlayers}));
      guestSelectors.push(new dataSelector({data: this.options.guestPlayers}));
      this.showChildView('host'+ i, hostSelectors[i]);
      this.showChildView('guest'+ i, guestSelectors[i]);
    }
  }
});

const GamesView = Marionette.CollectionView.extend({
  className: 'games',
  childView: GameView,
  initialize: function (options) {
    this.childViewOptions = options;
  }
});

const ProtocolView = Marionette.View.extend({
  template: require('../../../templates/meeting/protocol.hbs'),
  className: 'protocol',
  regions: {
    gamesRegion: '.js-gamesRegion'
  },
  initialize: function (options) {
    this.options = options;
  },

  onRender: function () {
    this.hostPlayers = new Players();
    this.guestPlayers = new Players();
    this.collection = new Games();
    Promise.all([
      this.collection.fetch({data: {meeting: this.model.id}}),
      this.guestPlayers.fetch({data: {owner: this.model.get('guest')}}),
      this.hostPlayers.fetch({data: {owner: this.model.get('host')}})
    ]).then(() => {
      this.showChildView('gamesRegion', new GamesView({
        collection: this.collection,
        guestPlayers: this.guestPlayers,
        hostPlayers: this.hostPlayers
      }));
    })
    //this.collection.getEmptyCollection();
  }
});

export default ProtocolView;