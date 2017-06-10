/**
 * Created by pavluhin on 06.03.2017.
 */


"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Teams from '../../entities/teams';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Preloader from '../../behaviors/preloader';
import TeamView from './team';


//TODO: remove this layout as unnecessary
let channelGlobal = Radio.channel('global');

const TeamLayout = Marionette.View.extend({
    template: require('../../../templates/team/layout.hbs'),
    regions: {
        // logoRegion: '.js-logoRegion',
        // playersRegion: '.js-logoRegion',
        // meetingsRegion: '.js-meetingsRegion',
        newTeamRegion: '.js-newTeamRegion'
    },

    initialize: function (options) {
        this.options = options;
        channelGlobal.on('user:updated', this.showTeam.bind(this));
    },

    showTeam: function (team) {
        this.showChildView('newTeamRegion', new TeamView({model: team, owner: team.id}));
    },

    onRender: function () {
        this.user = channelGlobal.request('get:user');
        let collection = new Teams();
        let model = new collection.model({_id: this.options.id});
        // collection.add(model);
        model.fetch().then(function (team) {
            this.showTeam(model);
        }.bind(this))
    }
});


export default TeamLayout;