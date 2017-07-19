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

  collectionEvents : {
    'sync' : 'setItems'
  },

  regions: {
    host0: '.js-firstHost',
    host1: '.js-secondHost',
    guest0: '.js-firstGuest',
    guest1: '.js-secondGuest'
  },

  ui: {
    game0ScoreHost: '.js-game0 > input.host',
    game1ScoreHost: '.js-game1 > input.host',
    game0ScoreGuest: '.js-game0 > input.guest',
    game1ScoreGuest: '.js-game1 > input.guest'
  },

  initialize: function (options) {
    this.options = options;
  },

  onRender: function () {
    let type = this.model.get('type');
    this.hostSelectors = [];
    this.guestSelectors = [];
    for (var i = 0; i < type; i++) {
      this.hostSelectors.push(new dataSelector({data: this.options.hostPlayers, index: i}));
      this.guestSelectors.push(new dataSelector({data: this.options.guestPlayers, index: i}));
      this.showChildView('host' + i, this.hostSelectors[i]);
      this.showChildView('guest' + i, this.guestSelectors[i]);
      this.hostSelectors[i].on('change:player', this.changeHostPlayer.bind(this));
      this.guestSelectors[i].on('change:player', this.changeGuestPlayer.bind(this));
    }
    var scores = this.el.querySelectorAll('input');
    for (var i = 0; i < scores.length; i++) {
      scores[i].onchange = this.changeScore.bind(this);
    }
    this.setItems();
  },

  setItems: function () {
    let type = this.model.get('type');
    for (var i = 0; i < type; i++) {
      if (this.model.get('hostPlayer'+i)) {
        this.hostSelectors[i].setSelected(this.options.hostPlayers.get(this.model.get('hostPlayer'+i)), true);
      }
      if (this.model.get('guestPlayer'+i)) {
        this.guestSelectors[i].setSelected(this.options.guestPlayers.get(this.model.get('guestPlayer'+i)), true);
      }
    }
    if (this.model.get('hostScore0')) this.ui.game0ScoreHost.val(this.model.get('hostScore0'));
    if (this.model.get('hostScore1')) this.ui.game1ScoreHost.val(this.model.get('hostScore1'));
    if (this.model.get('guestScore0')) this.ui.game0ScoreGuest.val(this.model.get('guestScore0'));
    if (this.model.get('guestScore1')) this.ui.game1ScoreGuest.val(this.model.get('guestScore1'));
  },

  changeHostPlayer: function (model, index) {
    var obj = {};
    obj['hostPlayer' + index] = model.id;
    this.model.saveChanges(obj);
  },

  changeGuestPlayer: function (model, index) {
    var obj = {};
    obj['hostPlayer' + index] = model.id;
    this.model.saveChanges(obj);
  },

  changeScore: function (e) {
    var obj = {};
    obj[e.target.dataset.name] = e.target.value;
    this.model.saveChanges(obj);
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
    //TODO: use websockets istead of this shit
    setInterval(function() {
      this.collection.fetch({data: {meeting: this.model.id}})
    }.bind(this), 500);
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
  }
});

export default ProtocolView;