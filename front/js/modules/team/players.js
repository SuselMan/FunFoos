/**
 * Created by pavluhin on 31.03.2017.
 */


import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Players from '../../entities/players';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Preloader from '../../behaviors/preloader';

const channelGlobal = Radio.channel('global');

const ButtonView = Marionette.View.extend({
  template: require('../../../templates/team/addPlayer.hbs'),
  tagName: 'button',
  className: 'team-player flex-card',
  events: {
    click: 'createPlayer'
  },

  initialize(options) {
    this.options = options;
    this.model = this.options.team;
  },

  createPlayer() {
    channelGlobal.trigger('modal:show', { view: 'newPlayer', team: this.options.team });
  }

});

const PlayerView = Marionette.View.extend({
  template: require('../../../templates/team/player.hbs'),
  tagName: 'div',
  className: 'team-player flex-card',

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
    channelGlobal.request('navigate', `player/${this.model.id}`, { trigger: true, replace: true });
  },

  onRender() {
    const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);
  }
});

const EmptyView = Marionette.View.extend({
  template: require('../../../templates/team/empty.hbs'),
  tagName: 'div'
  // className: 'list-group-item',
});

const PlayersView = Marionette.CollectionView.extend({
  childView: PlayerView,
  emptyView: EmptyView,
  className: 'col-12 team-players-container',
  collectionEvents: {
    sync: 'render'
  },

  initialize(options) {
    this.options = options;
  },

  onRender() {
    this.addChildView(new ButtonView({ team: this.options.team }), 0);
  }
});

const PlayersLayout = Marionette.View.extend({
  template: require('../../../templates/team/players.hbs'),
  collection: new Players(),
  behaviors: [Preloader],

  regions: {
    listRegion: {
      el: '.js-listRegion'
    }
  },

  initialize(options) {
    this.options = options;
    channelGlobal.on('player:created', this.fetchPlayers.bind(this));
  },

  fetchPlayers() {
    return this.collection.fetch({ data: { owner: this.options.owner } });
  },

  onRender() {
    this.fetchPlayers()
      .then(() => {
        this.showChildView('listRegion', new PlayersView({
          team: this.model.toJSON(),
          collection: this.collection
        }));
        this.triggerMethod('fetch:complete');
      })
      .catch((err) => {
        console.error(err);
      });
  }
});

export default PlayersLayout;
