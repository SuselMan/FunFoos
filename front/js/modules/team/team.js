/**
 * Created by ilya on 08.03.2017.
 */

"use strict";


import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import NewTeamView from './newTeam';


let channelGlobal = Radio.channel('global');

const TeamLayout = Marionette.View.extend({
    template: require('../../../templates/team/team.hbs'),
    regions: {
         logoRegion: '.js-logoRegion'
    },

    initialize: function(options){
        console.log('MODEL',this.model);
    },

    showTeam:function(){

    },

    onRender:function(){
    }
});


export default TeamLayout;