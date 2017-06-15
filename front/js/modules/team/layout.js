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

    showTeam: function (team, collection) {
        this.showChildView('newTeamRegion', new TeamView({model: team, owner: team.id, collection:collection}));
    },

    onRender: function () {
        this.user = channelGlobal.request('get:user');
        var collection = new Teams();
        var model = new collection.model({_id: this.options.id});
        collection.fetch()
            .then(function(){
                model = collection.get(this.options.id);
                this.showTeam(model,collection);
            }.bind(this))
    }
});


export default TeamLayout;