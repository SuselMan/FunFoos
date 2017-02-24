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
        console.log('index');
        channelGlobal.request('navigate', 'main', {trigger: true, replace: true});
    },

    mainWindow: function(id) {
        let module = MainModule;
        module.start();
        console.log('module.start');
        channelGlobal.request('select:nav:item', 'MainWindow');
        channelGlobal.request('hide:app:loader');
    },

    playersWindow: function(id) {
      console.log('players in controller')
    },

    teamsWindow: function(id) {
        console.log('teams in controller')
    }

};

export default appController;