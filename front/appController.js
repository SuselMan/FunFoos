/**
 * Created by pavluhin on 07.02.2017.
 */

"use strict";

import App from './app';
import Radio from 'backbone.radio';

var channelGlobal = Radio.channel('global')

var appController = {

    index: function() {
        channelGlobal.request('navigate', 'teams', {trigger: true, replace: true});
    },

    playersWindow: function(id) {
      console.log('players in controller')
    },

    teamsWindow: function(id) {
        console.log('teams in controller')
    }

};

export default appController;