/**
 * Created by pavluhin on 10.10.2017.
 */


import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Subseasons from '../../entities/subseasons';
import Cities from '../../entities/cities';
import moment from 'moment';
import UploadView from '../../widgets/fileUploader/fileUploader';
import DivisionsView from './divisions';

const channelGlobal = Radio.channel('global');

const LogoView = Marionette.View.extend({
  template: require('../../../templates/subseason/logo.hbs'),
  className: 'big-logo'
});

const SubseasonLayout = Marionette.View.extend({
  template: require('../../../templates/subseason/subseason.hbs'),
  collection: new Subseasons(),
  className: 'container big-header-layout subseason',

  ui: {
    dateSelector: '.js-date'
  },

  events: {
    'click @ui.dateSelector': 'showDateSelector'
  },

  regions: {
    divisionsRegion: '.js-divisionsRegion',
    logoRegion: '.js-logoRegion'
  },

  initialize(options) {
    this.options = options;
    this.model = new this.collection.model({ _id: this.options.id });
    this.cities = new Cities();
    Promise.all([this.model.fetch(), this.cities.fetch()])
      .then(
        () => {
          // TODO: refactor this shit
          this.fetched = true;
          this.render();
        }
      );
  },

  onRender() {
    if (this.fetched) {
      const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
      new ModelBinder().bind(this.model, this.el, bindings);
      this.showChildView('divisionsRegion', new DivisionsView({ model: this.model }));
      this.setLogoRegion();
    }
  },

  setLogoRegion() {
    const city = this.model.get('city');
    const image = this.cities.get(city).get('image');
    if (image) {
      this.showChildView('logoRegion', new LogoView({ model: this.cities.get(city) }));
    }
  },

  saveImage(image) {
    this.model.save({ image })
      .then(() => {
        this.showChildView('logoRegion', new LogoView({ model: this.model }));
      });
  },

  showDateSelector() {
    console.log('showDateSelector');
    channelGlobal.trigger('modal:show', { view: 'dateSelector', collection: this.places });
  }
});


export default SubseasonLayout;
