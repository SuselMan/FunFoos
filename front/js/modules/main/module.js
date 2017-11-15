/**
 * Created by ilya on 24.02.2017.
 */


import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import App from '../../../app';

import Layout from './layout';


class MainWindow {
  constructor(name) {
    this.name = name;
    this.layout = new Layout();
  }

  start() {
    try {
      App.showView(this.layout);
    } catch (e) {
      console.error('e', e);
    }
  }

  setView(view, option) {
    this.layout.start(view, option);
  }
}

const module = new MainWindow();

export default module;
