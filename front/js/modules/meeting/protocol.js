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
      this.hostSelectors[i].on('change:player', this.change.bind(this));
      this.guestSelectors[i].on('change:player', this.change.bind(this));
    }
    var scores = this.el.querySelectorAll('input');
    for (var i = 0; i < scores.length; i++) {
      scores[i].onchange = this.change.bind(this);
    }
    this.setItems();
  },

  setItems: function () {
    let type = this.model.get('type');
    for (var i = 0; i < type; i++) {
      if (this.model.get('hostPlayers')[i]) {
        this.hostSelectors[i].setSelected(this.options.hostPlayers.get(this.model.get('hostPlayers')[i]));
      }
      if (this.model.get('guestPlayers')[i]) {
        this.guestSelectors[i].setSelected(this.options.guestPlayers.get(this.model.get('guestPlayers')[i]));
      }
    }
    if (this.model.get('hostScore')[0]) this.ui.game0ScoreHost.val(this.model.get('hostScore')[0]);
    if (this.model.get('hostScore')[1]) this.ui.game1ScoreHost.val(this.model.get('hostScore')[1]);
    if (this.model.get('guestScore')[0]) this.ui.game0ScoreGuest.val(this.model.get('guestScore')[0]);
    if (this.model.get('guestScore')[1]) this.ui.game1ScoreGuest.val(this.model.get('guestScore')[1]);
  },

  change: function (e) {
    //TODO refactor;
    let type = this.model.get('type');
    let hostPlayers = [null, null];
    let guestPlayers = [null, null];
    for (var i = 0; i < type; i++) {
      console.log(this.hostSelectors[i].current);
      if (this.hostSelectors[i].current) {
        hostPlayers[i] = this.hostSelectors[i].current.id;
      }
      if (this.guestSelectors[i].current) {
        guestPlayers[i] = this.guestSelectors[i].current.id;
      }
    }
    var newModel = {
      hostPlayers: hostPlayers,
      guestPlayers: guestPlayers,
      hostScore: [parseInt(this.ui.game0ScoreHost.val()), parseInt(this.ui.game1ScoreHost.val())],
      guestScore: [parseInt(this.ui.game0ScoreGuest.val()), parseInt(this.ui.game1ScoreGuest.val())]
    };

    var oldModel = this.model.toJSON();
    oldModel.hostPlayers = oldModel.hostPlayers.length ? oldModel.hostPlayers : [null, null];
    oldModel.guestPlayers = oldModel.hostPlayers.guestPlayers ? oldModel.guestPlayers : [null, null];
    oldModel.guestScore = oldModel.hostPlayers.guestScore ? oldModel.guestScore : [0, 0];
    oldModel.hostScore = oldModel.hostPlayers.hostScore ? oldModel.hostScore : [0, 0];

    var saveModel = {};
    for (let i = 0; i < newModel.hostPlayers.length; i++) {
      if (newModel.hostPlayers[i] !== oldModel.hostPlayers[i]) {
        if (!saveModel.hostPlayers) {
          saveModel.hostPlayers = [null, null];
        }
        saveModel.hostPlayers[i] = newModel.hostPlayers[i]
      }
    }

    for (let i = 0; i < newModel.guestPlayers.length; i++) {
      if (newModel.guestPlayers[i] !== oldModel.guestPlayers[i]) {
        if (!saveModel.guestPlayers) {
          saveModel.guestPlayers = [null, null];
        }
        saveModel.guestPlayers[i] = newModel.guestPlayers[i]
      }
    }

    for (let i = 0; i < newModel.guestScore.length; i++) {
      if (newModel.guestScore[i] !== oldModel.guestScore[i]) {
        if (!saveModel.guestScore) {
          saveModel.guestScore = [null, null];
        }
        saveModel.guestScore[i] = newModel.guestScore[i]
      }
    }

    for (let i = 0; i < newModel.hostScore.length; i++) {
      if (newModel.hostScore[i] !== oldModel.hostScore[i]) {
        if (!saveModel.hostScore) {
          saveModel.hostScore = [null, null];
        }
        saveModel.hostScore[i] = newModel.hostScore[i]
      }
    }

    console.log('save', saveModel);
    this.model.save(saveModel);
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