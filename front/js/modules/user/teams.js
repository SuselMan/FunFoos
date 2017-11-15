/**
 * Created by pavluhin on 31.03.2017.
 */


import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Teams from '../../entities/teams';
import Seasons from '../../entities/seasons';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Preloader from '../../behaviors/preloader';

const channelGlobal = Radio.channel('global');


const TeamView = Marionette.View.extend({
  template: require('../../../templates/user/team.hbs'),
  tagName: 'li',
  className: 'list-group-item',

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
    channelGlobal.request('navigate', `team/${this.model.id}`, { trigger: true, replace: true });
  },

  onRender() {
    const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);
  }
});

const EmptyView = Marionette.View.extend({
  template: require('../../../templates/user/empty.hbs'),
  tagName: 'li',
  className: 'list-group-item'
});

const TeamsView = Marionette.CollectionView.extend({
  childView: TeamView,
  emptyView: EmptyView
});

const TeamsLayout = Marionette.View.extend({
  template: require('../../../templates/teams/teams.hbs'),
  collection: new Teams(),
  behaviors: [Preloader],
  regions: {
    listRegion: {
      el: '.js-listRegion'
    }
  },

  initialize(options) {
    this.options = options;
    channelGlobal.on('team:created', this.fetchTeams.bind(this));
  },

  fetchTeams() {
    return this.collection.fetch({ data: { owner: this.options.owner } });
  },

  onRender() {
    this.fetchTeams()
      .then(() => {
        this.showChildView('listRegion', new TeamsView({
          collection: this.collection
        }));
        this.triggerMethod('fetch:complete');
      })
      .catch((err) => {
        console.error(err);
      });
  }
});

export default TeamsLayout;
