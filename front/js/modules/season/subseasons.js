/**
 * Created by pavluhin on 09.10.2017.
 */


"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Subseasons from '../../entities/subseasons';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Preloader from '../../behaviors/preloader';
import Cities from '../../entities/cities';

let channelGlobal = Radio.channel('global');

const ButtonView = Marionette.View.extend({
  template: require('../../../templates/team/addPlayer.hbs'),
  tagName: 'button',
  className: 'team-player flex-card',
  events: {
    'click': 'createPlayer'
  },

  initialize: function(options){
    this.options = options;
    this.model = this.options.team;
  },

  selectCity: function () {
    channelGlobal.trigger('modal:show', {view: 'citySelector', collection: new Cities()});
  }

});

const SubseasonView = Marionette.View.extend({
  template: require('../../../templates/team/player.hbs'),
  tagName: 'div',
  className: 'team-player flex-card',

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
  // className: 'list-group-item',
});

const SubseasonsView = Marionette.CollectionView.extend({
  childView: SubseasonView,
  emptyView: EmptyView,
  className: 'col-12 team-players-container',
  collectionEvents : {
    'sync' : 'render'
  },

  initialize: function(options){
    this.options = options;
  },

  onRender: function () {
    this.addChildView(new ButtonView({team:this.options.team}), 0);
  }
});

const SubseasonLayout = Marionette.View.extend({
  template: require('../../../templates/team/players.hbs'),
  collection: new Players(),
  behaviors: [Preloader],

  regions: {
    listRegion: {
      el: '.js-listRegion'
    }
  },

  initialize: function (options) {
    this.options = options;
    channelGlobal.on('city:selected', this.fetchSubseasons.bind(this));
  },

  fetchSubseasons: function () {
    return this.collection.fetch({data: {season: this.options.season}});
  },

  onRender: function () {
    this.fetchSubseasons()
      .then(function () {
        this.showChildView('listRegion', new SubseasonsView({
          team:this.model.toJSON(),
          collection: this.collection
        }));
        this.triggerMethod('fetch:complete');
      }.bind(this))
      .catch(function (err) {
        console.error(err);
      })
  }
});

export default SubseasonLayout;