/**
 * Created by ipavl on 15.06.2017.
 */


import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

const channelGlobal = Radio.channel('global');

const DataSelector = Marionette.View.extend({
  template: require('./dataSelector.hbs'),
  tagName: 'div',
  className: 'data-selector',
  events: {
    click: 'navigate'
  },

  initialize(options) {
    this.options = options;
    this.data = options.data;
    this.current = null;
  },

  onRender() {
    if (!this.options.selectable) {
      //this.el.querySelector('span.secondName').textContent = '—';
      this.block();
    }
  },

  block() {
    this.el.classList.add('non-selectable');
  },

  setSelected(model, silent) {
    console.log('setSelected');
    this.current = model;
    // this.el.querySelector('span').innerHTML = `${model.get('firstName')} ${model.get('secondName')}`;
    this.el.querySelector('span.firstName').innerHTML = model.get('firstName');
    this.el.querySelector('span.secondName').innerHTML = model.get('secondName');
    const image = model.get('image');
    if (image) {
      this.el.setAttribute('style', `background-image:url(${image})`);
    } else {
      this.el.setAttribute('style', '');
    }
    if (!silent) {
      this.trigger('change:player', this.current, this.options.index);
      channelGlobal.off('player:selected');
    }
  },

  navigate() {
    if (this.options.selectable) {
      channelGlobal.off('player:selected');
      channelGlobal.on('player:selected', model => this.setSelected(model));
      channelGlobal.trigger('modal:show', { view: 'playerSelector', collection: this.data });
    }
  }
});


export default DataSelector;
