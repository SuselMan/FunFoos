/**
 * Created by pavluhin on 05.07.2017.
 */


import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import BaseModalView from './baseModal';

const channelGlobal = Radio.channel('global');

const TeamView = Marionette.View.extend({
  template: require('../../../templates/modals/components/teamCard.hbs'),
  tagName: 'div',
  className: 'flex-card',

  ui: {
    deleteBtn: '.js-deleteBtn'
  },

  events: {
    'click @ui.deleteBtn': 'deleteTeam',
    click: 'navigate'
  },

  deleteTeam(e) {
    e.stopPropagation();
    this.model.destroy();
  },

  navigate() {
    channelGlobal.trigger('team:selected', this.model);
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

const TeamsView = Marionette.CollectionView.extend({
  childView: TeamView,
  emptyView: EmptyView,
  className: 'col-12 team-players-container',

  initialize(options) {
    this.options = options;
  },

  onRender() {

  }
});

const SelectTeamView = BaseModalView.extend({
  template: require('../../../templates/modals/selectTeam.hbs'),

  regions: {
    teamsRegion: '.js-teamsRegion'
  },

  initialize(options) {
    this.options = options;
  },

  onRender() {
    this.showChildView('teamsRegion', new TeamsView({
      collection: this.collection
    }));
  }
});

export default SelectTeamView;
