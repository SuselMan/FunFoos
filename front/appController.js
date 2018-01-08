/**
 * Created by pavluhin on 07.02.2017.
 */

import App from './app';
import MainModule from './js/modules/main/module';

const appController = {

  index() {
    this.checkMainModule();
    // channelGlobal.request('navigate', 'main', {trigger: true, replace: true});
  },

  // userWindow() {
  //   this.checkMainModule();
  //   App.mainModule.setView('user');
  // },

  seasonsWindow() {
    this.checkMainModule();
    App.mainModule.setView('seasons');
  },

  seasonWindow(id) {
    this.checkMainModule();
    App.mainModule.setView('season', id);
  },

  subseasonWindow(id) {
    this.checkMainModule();
    App.mainModule.setView('subseason', id);
  },

  playersWindow() {
    this.checkMainModule();
    App.mainModule.setView('players');
  },

  teamsWindow() {
    this.checkMainModule();
    App.mainModule.setView('teams');
  },

  teamWindow(id) {
    this.checkMainModule();
    App.mainModule.setView('team', id);
  },

  cityWindow(id) {
    this.checkMainModule();
    App.mainModule.setView('city', id);
  },

  citiesWindow() {
    this.checkMainModule();
    App.mainModule.setView('cities');
  },

  meetingsWindow() {
    this.checkMainModule();
    App.mainModule.setView('meetings');
  },

  meetingWindow(id) {
    this.checkMainModule();
    App.mainModule.setView('meeting', id);
  },

  checkMainModule() {
    if (!App.mainModule) {
      App.mainModule = MainModule;
      App.mainModule.start();
    }
  }
};

export default appController;
