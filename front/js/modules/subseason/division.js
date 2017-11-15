/**
 * Created by pavluhin on 11.11.2017.
 */


import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import Teams from '../../entities/teams';
import Meetings from '../../entities/meetings';
import TeamsView from './teamsList';
import MeetingsView from './meetings';

const channelGlobal = Radio.channel('global');

export default Marionette.View.extend({
  template: require('../../../templates/subseason/divisionDetails.hbs'),
  tagName: 'div',
  className: 'container details',
  regions: {
    teamsList: '.js-teamsList',
    meetingsTable: '.js-meetingsTable'
  },
  ui: {
    addTeamBtn: '.js-addTeam'
  },
  events: {
    'click @ui.addTeamBtn': 'showTeamSelector'
  },

  initialize(options) {
    this.options = options;
    this.user = channelGlobal.request('get:user');
    this.teams = new Teams();
    this.registeredTeams = new Teams();
  },

  onRender() {
    this.registeredTeams.fetch({ data: { division: this.model.id } })
      .then(() => {
        this.showChildView('teamsList', new TeamsView({ collection: this.registeredTeams }));
        this.meetings = new Meetings();
        return this.meetings.fetch({ data: { owner: this.model.id } });
      })
      .then(() => {
        this.showChildView('meetingsTable', new MeetingsView({
          meetings: this.meetings,
          teams: this.registeredTeams
        }));
      });
  },

  showTeamSelector() {
    let opts = { data: { owner: this.user.id } };
    if (this.user.get('isAdmin')) {
      opts = {};
    }
    this.teams.fetch(opts)
      .then(() => {
        channelGlobal.trigger('modal:show', { view: 'teamSelector', collection: this.teams });
        channelGlobal.off('team:selected');
        channelGlobal.on('team:selected', team => this.addTeam(team));
      });
  },

  addTeam(team) {
    team.set('division', this.model.id);
    team.save();
  }
});
