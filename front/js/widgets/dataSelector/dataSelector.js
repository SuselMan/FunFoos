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

  setSelected(model, silent) {
    this.current = model;
    this.el.querySelector('span').innerHTML = `${model.get('firstName')} ${model.get('secondName')}`;
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
    channelGlobal.on('player:selected', this.setSelected.bind(this));
    channelGlobal.on('modal:close', () => {
      channelGlobal.off('player:selected');
    });
    channelGlobal.trigger('modal:show', { view: 'playerSelector', collection: this.data });
  }
});


export default DataSelector;
