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

const CityView = Marionette.View.extend({
  template: require('../../../templates/modals/components/cityCard.hbs'),
  tagName: 'div',
  className: 'flex-card',

  ui: {
    deleteBtn: '.js-deleteBtn'
  },

  events: {
    'click': 'navigate'
  },

  navigate: function () {
    channelGlobal.trigger('city:selected',this.model);
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

const CitiesView = Marionette.CollectionView.extend({
  childView: CityView,
  emptyView: EmptyView,
  className: 'col-12 team-players-container',

  initialize: function(options){
    this.options = options;
  }
});

const SelectCityView = BaseModalView.extend({
  template: require('../../../templates/modals/selectCity.hbs'),

  regions: {
    citiesRegion: '.js-citiesRegion'
  },

  initialize: function (options) {
    this.options = options;
  },

  onRender: function () {
    this.showChildView('citiesRegion', new CitiesView({
      collection: this.collection
    }));
  }
});

export default SelectCityView;