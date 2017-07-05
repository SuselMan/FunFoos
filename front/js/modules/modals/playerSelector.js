/**
 * Created by pavluhin on 05.07.2017.
 */

"use strict";

import Marionette from 'backbone.marionette';
import Players from '../../entities/players';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import BaseModalView from './baseModal'
import UploadView from '../../widgets/fileUploader/fileUploader';

let channelGlobal = Radio.channel('global');

const PlayerView = Marionette.View.extend({
  template: require('../../../templates/team/player.hbs'),
  tagName: 'div',
  className: 'team-player',

  ui: {
    deleteBtn: '.js-deleteBtn'
  },

  events: {
    'click @ui.deleteBtn': 'deletePlayer',
    'click': 'navigate'
  },

  deletePlayer: function (e) {
    e.stopPropagation();
    this.model.destroy();
  },

  navigate: function () {
    channelGlobal.request('navigate', 'player/' + this.model.id, {trigger: true, replace: true});
  },

  onRender: function () {
    var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);
  }
});

const EmptyView = Marionette.View.extend({
  template: require('../../../templates/team/empty.hbs'),
  tagName: 'div'
});

const PlayersView = Marionette.CollectionView.extend({
  childView: PlayerView,
  emptyView: EmptyView,
  className: 'col-12 team-players-container',

  initialize: function(options){
    this.options = options;
  },

  onRender: function () {

  }
});

const SelectTeamView = BaseModalView.extend({
  template: require('../../../templates/modals/selectPlayer.hbs'),

  regions: {
    playersRegion: '.js-playersRegion'
  },

  initialize: function (options) {
    this.options = options;
  },

  onRender: function () {
    this.showChildView('playersRegion', new PlayersView({
      collection: this.collection
    }));
  }
});

export default SelectTeamView;