/**
 * Created by pavluhin on 03.10.2017.
 */


import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Cities from '../../entities/cities';
import Places from '../../entities/places';
import moment from 'moment';
import UploadView from '../../widgets/fileUploader/fileUploader';
import PlacesView from './places';

const channelGlobal = Radio.channel('global');

const LogoView = Marionette.View.extend({
  template: require('../../../templates/city/logo.hbs'),
  className: 'big-logo'
});

export default Marionette.View.extend({
  template: require('../../../templates/city/city.hbs'),
  collection: new Cities(),
  className: 'container big-header-layout season',

  regions: {
    placesRegion: '.js-placesRegion',
    logoRegion: '.js-logoRegion'
  },

  initialize(options) {
    this.options = options;
    this.model = new this.collection.model({ _id: this.options.id });
    this.user = channelGlobal.request('get:user');
    this.model.fetch()
      .then(
        () => {
          // TODO: refactor this terror;
          this.fetched = true;
          this.render();
        }
      );
  },

  onRender(model) {
    if (this.fetched) {
      const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
      new ModelBinder().bind(this.model, this.el, bindings);
      this.places = new Places();
      this.places.fetch({ data: { city: this.model.id } })
        .then(() => {
          this.showChildView('placesRegion', new PlacesView({ collection: this.places, city: this.model }));
        });

      this.setLogoRegion();
    }
  },

  setLogoRegion() {
    if (this.uploadView) {
      this.uploadView.off('load:complete');
      channelGlobal.off('image:selected');
    }
    this.getRegion('logoRegion').empty();
    if (this.model.get('image')) {
      this.showChildView('logoRegion', new LogoView({ model: this.model }));
    } else {
      this.uploadView = new UploadView();
      this.showChildView('logoRegion', this.uploadView);
      this.uploadView.on('load:complete', this.showLogo.bind(this));
      channelGlobal.on('image:selected', this.callImageCropper.bind(this));
    }
  },

  callImageCropper(image) {
    channelGlobal.trigger('modal:show', { view: 'imageCropper', image });
    channelGlobal.on('modal:imageCropped', this.saveImage.bind(this));
  },

  saveImage(image) {
    this.model.save({ image })
      .then(() => {
        this.showChildView('logoRegion', new LogoView({ model: this.model }));
      });
  },

  showLogo(url) {
    this.model.set('image', url);
    this.model.update();
    this.showChildView('logoRegion', new LogoView({ model: this.model }));
  }
});
