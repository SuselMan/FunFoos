/**
 * Created by pavluhin on 24.08.2017.
 */


import Radio from 'backbone.radio';
import 'flatpickr';
import BaseModalView from './baseModal';

const channelGlobal = Radio.channel('global');

const SelectDateView = BaseModalView.extend({
  template: require('../../../templates/modals/selectDate.hbs'),

  ui: {
    date: '.js-date',
    closeBtn: '.js-closeBtn',
    submitBtn: '.js-submitBtn'
  },

  events: {
    'click @ui.closeBtn': 'close',
    'click @ui.submitBtn': 'submit'
  },

  initialize(options) {
    this.options = options;
    this.date = null;
  },

  onRender() {
    this.el.querySelector('.js-date').flatpickr({
      enableTime: true,
      inline: true,
      minDate: 'today',
      onChange: this.changeDate.bind(this)
    });
  },
  changeDate(event) {
    this.date = event[0].getTime() / 1000;
    this.el.querySelector('.js-submitBtn').disabled = false;
  },
  navigate() {
    channelGlobal.trigger('place:selected', this.model);
    channelGlobal.trigger('modal:close');
  },

  close() {
    channelGlobal.trigger('modal:close');
  },

  submit() {
    if (this.date) {
      channelGlobal.trigger('date:selected', this.date);
      channelGlobal.trigger('modal:close');
    }
  }
});

export default SelectDateView;
