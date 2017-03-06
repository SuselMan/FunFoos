/**
 * Created by pavluhin on 06.03.2017.
 */

/**
 * Created by pavluhin on 28.02.2017.
 */

"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Teams from '../../entities/teams';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Preloader from '../../behaviors/preloader';

let channelGlobal = Radio.channel('global');

const NewTeamView = Marionette.View.extend({
    template: require('../../../templates/team/newTeam.hbs'),

    initialize: function(){

    },

    onRender:function(){

    }
});

const TeamLayout = Marionette.View.extend({
    template: require('../../../templates/team/layout.hbs'),
    regions: {
        // logoRegion: '.js-logoRegion',
        // playersRegion: '.js-logoRegion',
        // meetingsRegion: '.js-meetingsRegion',
        newTeamRegion:'.js-newTeamRegion'
    },

    initialize: function(){

    },

    onRender:function(){
        this.user = channelGlobal.request('get:user');
        console.log('USER',this.user);
        if(!this.user.get('team')){
            this.showChildView('newTeamRegion', new NewTeamView());
        }
    }
});


export default TeamLayout;