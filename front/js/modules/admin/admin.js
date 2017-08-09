/**
 * Created by pavluhin on 31.07.2017.
 */
"use strict";


import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';

let channelGlobal = Radio.channel('global');

const UserLayout = Marionette.View.extend({
  template: require('../../../templates/user/layout.hbs'),

  ui: {
    createTeamBtn: ".js-createTeam"
  },

  events: {
    'click @ui.createTeamBtn': 'createTeam'
  },

  regions: {
    teamsRegion: '.js-teamsRegion'
  },

  initialize: function (options) {
    this.options = options;
  },

  onRender: function () {

  }
});

export default UserLayout;