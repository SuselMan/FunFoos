/**
 * Created by pavluhin on 05.07.2017.
 */


import Marionette from 'backbone.marionette';
import Players from '../../entities/players';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import BaseModalView from './baseModal';
import UploadView from '../../widgets/fileUploader/fileUploader';

const channelGlobal = Radio.channel('global');

const PlayerView = Marionette.View.extend({
  template: require('../../../templates/modals/components/playerCard.hbs'),
  tagName: 'div',
  className: 'flex-card',

  ui: {
    deleteBtn: '.js-deleteBtn'
  },

  events: {
    'click @ui.deleteBtn': 'deletePlayer',
    click: 'navigate'
  },

  deletePlayer(e) {
    e.stopPropagation();
    this.model.destroy();
  },

  navigate() {
    channelGlobal.trigger('player:selected', this.model);
    channelGlobal.trigger('modal:close');
  },

  onRender() {
    const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
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

  initialize(options) {
    this.options = options;
  },

  onRender() {

  }
});

const SelectPlayerView = BaseModalView.extend({
  template: require('../../../templates/modals/selectPlayer.hbs'),

  regions: {
    playersRegion: '.js-playersRegion'
  },

  initialize(options) {
    this.options = options;
  },

  onRender() {
    this.showChildView('playersRegion', new PlayersView({
      collection: this.collection
    }));
  }
});

export default SelectPlayerView;
