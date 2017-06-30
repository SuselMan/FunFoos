/**
 * Created by pavluhin on 07.02.2017.
 */

"use strict";

import App from './app';
import Radio from 'backbone.radio';

import MainModule from './js/modules/main/module';

const channelGlobal = Radio.channel('global');

const appController = {

    index: function() {
        this.checkMainModule();
        //channelGlobal.request('navigate', 'main', {trigger: true, replace: true});
    },

    userWindow: function() {
        this.checkMainModule();
        App.mainModule.setView('user');
    },

    seasonsWindow: function() {
        this.checkMainModule();
        App.mainModule.setView('seasons');
    },

    playersWindow: function() {
        this.checkMainModule();
        App.mainModule.setView('players');
    },

    teamsWindow: function() {
        this.checkMainModule();
        App.mainModule.setView('teams');
    },

    teamWindow: function(id) {
        this.checkMainModule();
        App.mainModule.setView('team',id);
    },

    meetingsWindow: function() {
        this.checkMainModule();
        App.mainModule.setView('meetings');
    },

    meetingWindow: function(id) {
        console.log('we was here 444');
        this.checkMainModule();
        App.mainModule.setView('meeting',id);
        console.log('and here');
    },

    placesWindow: function() {
        this.checkMainModule();
        App.mainModule.setView('places');
    },

    checkMainModule:function(){
        if(!App.mainModule){
            App.mainModule = MainModule;
            App.mainModule.start();
        }
    }
};

export default appController;