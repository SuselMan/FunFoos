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

console.log('App',App);

App.on('start', function() {

    if (Backbone.history){
        Backbone.history.start({pushState: true});
    };

    App.Router = new AppRouter({
        controller: AppController
    });

});

App.start();