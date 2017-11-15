/**
 * Created by pavluhin on 27.03.2017.
 */

import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import TeamsView from './teams';

const channelGlobal = Radio.channel('global');

const UserLayout = Marionette.View.extend({
  template: require('../../../templates/user/layout.hbs'),

  ui: {
    createTeamBtn: '.js-createTeam'
  },

  events: {
    'click @ui.createTeamBtn': 'createTeam'
  },

  regions: {
    teamsRegion: '.js-teamsRegion'
  },

  initialize(options) {
    this.options = options;
    this.model = options.model;
  },

  onRender() {
    this.model.updateSignin()
      .then(() => {
        this.showChildView('teamsRegion', new TeamsView({
          owner: this.model.id
        }));
      })
      .catch(() => {
        // console.error('Need autintificate', error);
        // TODO: throw error or warning
      });
  },

  createTeam() {
    channelGlobal.trigger('modal:show', { view: 'newTeam', user: this.model });
  }
});

export default UserLayout;
