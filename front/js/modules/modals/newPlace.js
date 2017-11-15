/**
 * Created by pavluhin on 15.11.2017.
 */


import Marionette from 'backbone.marionette';
import Places from '../../entities/places';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import BaseModalView from './baseModal';
import UploadView from '../../widgets/fileUploader/fileUploader';
import ImageCropper from '../../widgets/imageCropper/imageCropper';

const channelGlobal = Radio.channel('global');

const ImageView = Marionette.View.extend({
  template: require('../../../templates/modals/image.hbs')
});

const NewTeamView = BaseModalView.extend({
  template: require('../../../templates/modals/newPlace.hbs'),

  regions: {
    imageRegion: '.js-imageRegion'
  },

  initialize(options) {
    this.options = options;
    this.collection = new Places();
    this.model = new this.collection.model();
    this.model.set('city', options.city.id);
    channelGlobal.off('image:selected');
  },

  onRender() {
    const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);

    if (this.model.get('image')) {
      this.showChildView('imageRegion', new ImageView({ model: this.model }));
    } else {
      this.showUploader();
    }
  },

  submit() {
    if (this.cropper) {
      this.cropper.getCroppedImage()
        .then((image) => {
          this.model.set('image', image);
          this.saveNewPlace();
        });
    } else {
      this.saveNewPlace();
    }
  },
  saveNewPlace() {
    this.collection.add(this.model);
    this.model.save()
      .then(() => {
        console.info('new place was created with owner', this.options.city.id);
        channelGlobal.trigger('place:created');
        channelGlobal.trigger('modal:close');
      })
      .catch((err) => {
        console.error(err);
      });
  },

  showUploader() {
    this.uploadView = null;
    this.uploadView = new UploadView();
    this.showChildView('imageRegion', this.uploadView);
    channelGlobal.on('image:selected', this.showCropper, this);
  },

  showCropper(file) {
    this.cropper = null;
    this.cropper = new ImageCropper({ file });
    this.showChildView('imageRegion', this.cropper);
    this.cropper.on('cropper:cancel', this.showUploader.bind(this));
  },

  showImage(url) {
    this.model.set('image', url);
    this.showChildView('imageRegion', new ImageView({ model: this.model }));
  }
});

export default NewTeamView;
