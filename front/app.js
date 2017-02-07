/**
 * Created by pavluhin on 10.11.2016.
 */

"use strict";

import Backbone from 'backbone';
import Marionette  from 'backbone.marionette';
import Radio from 'backbone.radio';

var socket = io.connect('http://localhost:8888');
var channelGlobal = Radio.channel('global');



var App = Marionette.Application.extend({
    region: '#js-app',

    initialize: function (options) {
        console.info('App Initialized');
        this.root = '/';
    },

    onStart: function () {
        console.info('App started');
    },

    navigate: function (route, options) {
        console.info('App navigated to', route);
        Backbone.history.navigate(route, options || {});
    },

    getCurrentRoute: function () {
        return Backbone.history.fragment;
    }

});

channelGlobal.reply('navigate', function (route, options) {
    console.info('channelGlobal app:navigate: ', arguments);
    Backbone.history.navigate(route, options || {});

});

var app = new App();

export default app;