/**
 * Created by pavluhin on 05.07.2017.
 */


import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import BaseModalView from './baseModal';

const channelGlobal = Radio.channel('global');

const PlaceView = Marionette.View.extend({
  template: require('../../../templates/modals/components/placeCard.hbs'),
  tagName: 'div',
  className: 'flex-card',

  ui: {
    deleteBtn: '.js-deleteBtn'
  },

  events: {
    'click @ui.deleteBtn': 'deletePlace',
    click: 'navigate'
  },

  deletePlace(e) {
    e.stopPropagation();
    this.model.destroy();
  },

  navigate() {
    channelGlobal.trigger('place:selected', this.model);
    channelGlobal.trigger('modal:close');
  },

  onRender() {
    const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);
  }
});

const EmptyView = Marionette.View.extend({
  template: require('../../../templates/team/empty.hbs'),
  tagName: 'div'
});

const PlacesView = Marionette.CollectionView.extend({
  childView: PlaceView,
  emptyView: EmptyView,
  className: 'col-12 team-places-container',

  initialize(options) {
    this.options = options;
  },

  onRender() {

  }
});

const SelectPlaceView = BaseModalView.extend({
  template: require('../../../templates/modals/selectPlace.hbs'),

  regions: {
    placesRegion: '.js-placesRegion'
  },

  initialize(options) {
    this.options = options;
  },

  onRender() {
    this.showChildView('placesRegion', new PlacesView({
      collection: this.collection
    }));
  }
});

export default SelectPlaceView;
