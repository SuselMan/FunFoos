/**
 * Created by pavluhin on 07.02.2017.
 */


import './sass/main.scss';
import 'babel-polyfill';
import Backbone from 'backbone';
import _ from 'underscore';
import App from './app';
import AppRouter from './appRouter';
import AppController from './appController';
import Radio from 'backbone.radio';

const channelGlobal = Radio.channel('global');

App.on('start', () => {
  App.Router = new AppRouter({
    controller: AppController
  });
  Backbone.history.start({ pushState: true });
  App.navigate(App.getCurrentRoute(), { trigger: true, replace: true });
});

window.onload = function () {
  App.start();
};
