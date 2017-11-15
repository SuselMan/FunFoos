/**
 * Created by pavluhin on 04.04.2017.
 */


import Marionette from 'backbone.marionette';
import Teams from '../../entities/teams';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';

const channelGlobal = Radio.channel('global');

const BaseModalView = Marionette.View.extend({
    
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
    console.info('baseModel submit function is not overriden');
  }
});

export default BaseModalView;
