/**
 * Created by pavluhin on 07.02.2017.
 */

"use strict";

import './sass/main.scss';
import 'babel-polyfill';
import Backbone from 'backbone';
import _ from 'underscore';
import App from './app';
import AppRouter from './appRouter';
import AppController from './appController';
import Radio from 'backbone.radio';

const channelGlobal = Radio.channel('global');

App.on('start', function() {

    if (Backbone.history){
        Backbone.history.start({pushState: true});
    };

    App.Router = new AppRouter({
        controller: AppController
    });
    channelGlobal.request('navigate', 'main', {trigger: true, replace: true});
});

App.start();