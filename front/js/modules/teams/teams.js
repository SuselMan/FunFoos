/**
 * Created by pavluhin on 28.02.2017.
 */


import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Teams from '../../entities/teams';
import Preloader from '../../behaviors/preloader';

const channelGlobal = Radio.channel('global');


const TeamView = Marionette.View.extend({
  template: require('../../../templates/teams/team.hbs'),
  tagName: 'li',
  className: 'list-group-item',
  ui: {
    name: '.name',
    image: '.image'
  },

  events: {
    'click @ui.name': 'navigateToTeam'
  },

  onRender() {
    const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);

    const image = this.model.get('image');
    if (image) {
      this.el.querySelector('.image').setAttribute('style', `background-image:url(${image})`);
    } else {
      this.el.querySelector('.image').setAttribute('style', '');
    }
  },

  navigateToTeam() {
    channelGlobal.request('navigate', `team/${this.model.id}`, { trigger: true, replace: true });
  }
});

const EmptyView = Marionette.View.extend({
  template: require('../../../templates/teams/empty.hbs'),
  tagName: 'li',
  className: 'list-group-item'
});

const TeamsView = Marionette.CollectionView.extend({
  childView: TeamView,
  emptyView: EmptyView
});

const TeamsLayout = Marionette.View.extend({
  template: require('../../../templates/teams/teams.hbs'),
  className: 'container teams',
  collection: new Teams(),
  behaviors: [Preloader],
  regions: {
    listRegion: {
      el: '.js-listRegion'
    },
    addTeamRegion: '.js-newTeamRegion'
  },

  ui: {
    createTeamBtn: '.js-createTeam'
  },

  events: {
    'click @ui.createTeamBtn': 'createTeam'
  },
  initialize() {
    this.user = channelGlobal.request('get:user');
  },

  onRender() {
    if(!this.user || !this.user.get('isAdmin')){
      this.ui.createTeamBtn.hide();
    }
    this.collection.fetch()
      .then(() => {
        this.showChildView('listRegion', new TeamsView({
          collection: this.collection
        }));
        this.triggerMethod('fetch:complete');
      })
      .catch(() => {
        // TODO: notification
      });
  },

  createTeam() {
    channelGlobal.trigger('modal:show', { view: 'newTeam', user: this.user });
  }

});

export default TeamsLayout;
