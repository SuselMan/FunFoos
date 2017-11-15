/**
 * Created by pavluhin on 04.04.2017.
 */


import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

const channelGlobal = Radio.channel('global');

export default Marionette.View.extend({

  ui: {
    closeBtn: '.js-closeBtn',
    submitBtn: '.js-submitBtn'
  },

  events: {
    'click @ui.closeBtn': 'close',
    'click @ui.submitBtn': 'submit'
  },

  close() {
    channelGlobal.trigger('modal:close');
  },

  submit() {
    // TODO: add some default behaviour
  }
});
