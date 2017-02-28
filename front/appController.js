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

    playersWindow: function(id) {
        this.checkMainModule();
    },

    teamsWindow: function(id) {
        this.checkMainModule();
        console.log('App.mainModule', App.mainModule);
        App.mainModule.setView('teams');
    },

    checkMainModule:function(){
        if(!App.mainModule){
            App.mainModule = MainModule;
            App.mainModule.start();
        }
    }
};

export default appController;