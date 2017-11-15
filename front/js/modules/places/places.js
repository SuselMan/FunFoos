/**
 * Created by pavluhin on 01.03.2017.
 */

import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Places from '../../entities/places';
import Preloader from '../../behaviors/preloader';

const channelGlobal = Radio.channel('global');


const PlaceView = Marionette.View.extend({
  template: require('../../../templates/places/place.hbs'),
  tagName: 'li',
  className: 'list-group-item',
  onRender() {
    const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);
  }
});

const EmptyView = Marionette.View.extend({
  template: require('../../../templates/places/empty.hbs'),
  tagName: 'li',
  className: 'list-group-item'
});

const PlacesView = Marionette.CollectionView.extend({
  childView: PlaceView,
  emptyView: EmptyView
});

const PlacesLayout = Marionette.View.extend({
  template: require('../../../templates/places/places.hbs'),
  collection: new Places(),
  behaviors: [Preloader],
  ui: {
    createPlaceBtn: '.js-createPlaceBtn'
  },
  events: {
    'click @ui.createPlaceBtn': 'createPlace'
  },
  regions: {
    listRegion: {
      el: '.js-listRegion'
    }
  },

  onRender() {
    this.collection.fetch()
      .then(() => {
        this.showChildView('listRegion', new PlacesView({
          collection: this.collection
        }));
        this.triggerMethod('fetch:complete');
      })
      .catch(() => {
        // TODO: throw error;
      });
  },
  createPlace() {
    channelGlobal.trigger('modal:show', { view: 'newPlace' });
  }
});

export default PlacesLayout;
