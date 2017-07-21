/**
 * Created by pavluhin on 05.07.2017.
 */

"use strict";

import Marionette from 'backbone.marionette';
import Places from '../../entities/places';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import BaseModalView from './baseModal'
import UploadView from '../../widgets/fileUploader/fileUploader';

let channelGlobal = Radio.channel('global');

const PlaceView = Marionette.View.extend({
  template: require('../../../templates/modals/components/placeCard.hbs'),
  tagName: 'div',
  className: 'flex-card',

  ui: {
    deleteBtn: '.js-deleteBtn'
  },

  events: {
    'click @ui.deleteBtn': 'deletePlace',
    'click': 'navigate'
  },

  deletePlace: function (e) {
    e.stopPropagation();
    this.model.destroy();
  },

  navigate: function () {
    channelGlobal.trigger('place:selected',this.model);
    channelGlobal.trigger('modal:close');
  },

  onRender: function () {
    var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
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

  initialize: function(options){
    this.options = options;
  },

  onRender: function () {

  }
});

const SelectPlaceView = BaseModalView.extend({
  template: require('../../../templates/modals/selectPlace.hbs'),

  regions: {
    placesRegion: '.js-placesRegion'
  },

  initialize: function (options) {
    console.log('lol');
    this.options = options;
  },

  onRender: function () {
    this.showChildView('placesRegion', new PlacesView({
      collection: this.collection
    }));
  }
});

export default SelectPlaceView;