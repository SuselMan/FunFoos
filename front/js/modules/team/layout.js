/**
 * Created by pavluhin on 06.03.2017.
 */


import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import Teams from '../../entities/teams';
import TeamView from './team';


// TODO: remove this layout as unnecessary
const channelGlobal = Radio.channel('global');

const TeamLayout = Marionette.View.extend({
  template: require('../../../templates/team/layout.hbs'),
  regions: {
    newTeamRegion: '.js-newTeamRegion'
  },

  initialize(options) {
    this.options = options;
    channelGlobal.on('user:updated', this.showTeam.bind(this));
  },

  showTeam(team, collection) {
    this.showChildView('newTeamRegion', new TeamView({ model: team, owner: team.id, collection }));
  },

  onRender() {
    this.user = channelGlobal.request('get:user');
    const collection = new Teams();
    let model = new collection.model({ _id: this.options.id });
    collection.fetch()
      .then(() => {
        model = collection.get(this.options.id);
        this.model = model;
        this.showTeam(model, collection);
      });
  }
});


export default TeamLayout;
