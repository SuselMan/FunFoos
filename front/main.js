/**
 * Created by pavluhin on 07.02.2017.
 */


import 'babel-polyfill';
import Backbone from 'backbone';
import App from './app';
import AppRouter from './appRouter';
import AppController from './appController';
import './sass/main.scss';

App.on('start', () => {
  App.Router = new AppRouter({
    controller: AppController
  });
  Backbone.history.start({ pushState: true });
  App.navigate(App.getCurrentRoute(), { trigger: true, replace: true });
});

window.onload = () => {
  App.start();
};
