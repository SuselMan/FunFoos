/**
 * Created by ilya on 24.02.2017.
 */

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
      // TODO: trow error;
    }
  }

  setView(view, option) {
    this.layout.start(view, option);
  }
}

const module = new MainWindow();

export default module;
