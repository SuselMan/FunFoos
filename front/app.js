/**
 * Created by pavluhin on 10.11.2016.
 */


import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

const channelGlobal = Radio.channel('global');


const App = Marionette.Application.extend({
  region: '#js-app',

  initialize() {
    this.root = '/';
  },

  navigate(route, options) {
    Backbone.history.navigate(route, options || {});
  },

  getCurrentRoute() {
    return Backbone.history.fragment;
  }

});

channelGlobal.reply('navigate', (route, options) => {
  Backbone.history.navigate(route, options || {});
});

const app = new App();

export default app;
