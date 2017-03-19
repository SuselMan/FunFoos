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
import NewTeamView from './newTeam';
import TeamView from './team';

let channelGlobal = Radio.channel('global');

const TeamLayout = Marionette.View.extend({
    template: require('../../../templates/team/layout.hbs'),
    regions: {
        // logoRegion: '.js-logoRegion',
        // playersRegion: '.js-logoRegion',
        // meetingsRegion: '.js-meetingsRegion',
        newTeamRegion:'.js-newTeamRegion'
    },

    initialize: function(){
        console.log('TeamLayout');
        channelGlobal.on('user:updated',this.showTeam.bind(this));
    },

    showTeam:function(team){
        this.showChildView('newTeamRegion', new TeamView({model:team}));
    },

    onRender:function(){
        console.log('TeamRender');
        this.user = channelGlobal.request('get:user');
        if(!this.user.get('team')){
            this.showChildView('newTeamRegion', new NewTeamView({user:this.user}));

        }
    }
});


export default TeamLayout;