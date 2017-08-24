/**
 * Created by pavluhin on 24.08.2017.
 */

"use strict";

import Radio from 'backbone.radio';
import BaseModalView from './baseModal'
import flatpickr from 'flatpickr';

let channelGlobal = Radio.channel('global');

const SelectDateView = BaseModalView.extend({
  template: require('../../../templates/modals/selectDate.hbs'),

  ui: {
    date: '.js-date',
    closeBtn: '.js-closeBtn'
  },

  events: {
    'click @ui.closeBtn': 'close',
  },

  initialize: function (options) {
    this.options = options;
  },

  onRender: function () {
    this.el.querySelector('.js-date').flatpickr({
      enableTime: true,
      inline:true
    })
  },

  navigate: function () {
    channelGlobal.trigger('place:selected',this.model);
    channelGlobal.trigger('modal:close');
  },

  close: function () {
    channelGlobal.trigger('modal:close');
  },
});

export default SelectDateView;