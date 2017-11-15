/**
 * Created by pavluhin on 31.03.2017.
 */


import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Players from '../../entities/players';
import BaseModalView from './baseModal';
import UploadView from '../../widgets/fileUploader/fileUploader';
import ImageCropper from '../../widgets/imageCropper/imageCropper';

const channelGlobal = Radio.channel('global');

const ImageView = Marionette.View.extend({
  template: require('../../../templates/modals/image.hbs')
});

const NewTeamView = BaseModalView.extend({
  template: require('../../../templates/modals/newPlayer.hbs'),

  regions: {
    imageRegion: '.js-imageRegion'
  },

  initialize(options) {
    this.options = options;
    this.collection = new Players();
    this.model = new this.collection.model();
    this.model.set('owner', options.team._id);
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
          this.saveNewPlayer();
        });
    } else {
      this.saveNewPlayer();
    }
  },
  saveNewPlayer() {
    this.collection.add(this.model);
    this.model.save()
      .then(() => {
        channelGlobal.trigger('player:created');
        channelGlobal.trigger('modal:close');
      })
      .catch(() => {
        // TODO: throw error;
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
