/**
 * Created by pavluhin on 27.03.2017.
 */

/**
 * Created by ilya on 08.03.2017.
 */

"use strict";


import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import TeamsView from './teams';

let channelGlobal = Radio.channel('global');

const UserLayout = Marionette.View.extend({
    template: require('../../../templates/user/layout.hbs'),

    ui:{
        createTeamBtn: ".js-createTeam"
    },

    events: {
        'click @ui.createTeamBtn': 'createTeam'
    },

    regions: {
        teamsRegion: '.js-teamsRegion'
    },

    initialize: function(options){
        this.options = options;
        this.model = options.model;
        console.info(this.model);
    },

    onRender:function(){
        this.showChildView('teamsRegion', new TeamsView({
            owner: this.model.id
        }));
    },

    createTeam :function() {
        channelGlobal.trigger('modal:show',{view:'newTeam',user:this.model})
    }
});


export default UserLayout;