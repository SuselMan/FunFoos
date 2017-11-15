/**
 * Created by pavluhin on 09.10.2017.
 */


import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';

const channelGlobal = Radio.channel('global');

const ButtonView = Marionette.View.extend({
  template: require('../../../templates/city/addPlace.hbs'),
  tagName: 'button',
  className: 'team-player flex-card',
  events: {
    click: 'selectCity'
  },

  initialize(options) {
    this.options = options;
  },

  selectCity() {
    channelGlobal.trigger('modal:show', { view: 'newPlace', city: this.options.city });
  }

});

const PlaceView = Marionette.View.extend({
  template: require('../../../templates/city/place.hbs'),
  tagName: 'div',
  className: 'team-player flex-card',

  ui: {
    deleteBtn: '.js-deleteBtn'
  },

  events: {
    click: 'navigate'
  },

  navigate() {
    channelGlobal.request('navigate', `place/${this.model.id}`, { trigger: true, replace: true });
  },

  onRender() {
    const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);
  }
});

export default Marionette.CollectionView.extend({
  childView: PlaceView,
  className: 'col-12 team-players-container',
  collectionEvents: {
    sync: 'render'
  },

  initialize(options) {
    this.options = options;
    this.childViewOptions = options;
    this.render();
  },

  onRender() {
    channelGlobal.off('place:created');
    channelGlobal.on('place:created', () => {
      this.collection.fetch({ data: { city: this.options.city.id } });
    });
    this.addChildView(new ButtonView({ city: this.options.city }), 0);
  }
});
