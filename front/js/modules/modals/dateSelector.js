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
    closeBtn: '.js-closeBtn',
    submitBtn:'.js-submitBtn'
  },

  events: {
    'click @ui.closeBtn': 'close',
    'click @ui.submitBtn': 'submit'
  },

  initialize: function (options) {
    this.options = options;
    this.date = null;
  },

  onRender: function () {
    this.el.querySelector('.js-date').flatpickr({
      enableTime: true,
      inline:true,
      minDate: "today",
      onChange:this.changeDate.bind(this)
    })
  },
  changeDate:function(event){
    console.log('change', event[0].getTime()/1000);
    this.date = event[0].getTime()/1000;
    this.el.querySelector('.js-submitBtn').disabled = false;
  },
  navigate: function () {
    channelGlobal.trigger('place:selected',this.model);
    channelGlobal.trigger('modal:close');
  },

  close: function () {
    channelGlobal.trigger('modal:close');
  },

  submit: function () {
    if(this.date){
      channelGlobal.trigger('date:selected',this.date);
      channelGlobal.trigger('modal:close');
    }
  }
});

export default SelectDateView;