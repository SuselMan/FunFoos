/**
 * Created by pavluhin on 28.02.2017.
 */

import Marionette from 'backbone.marionette';

const Preloader = Marionette.Behavior.extend({

  onFetchComplete() {
    this.el.querySelector('.preloader').style.display = 'none';
  }

});

export default Preloader;
