/**
 * Created by ilya on 26.08.2017.
 */

import Radio from 'backbone.radio';
import BaseModalView from './baseModal';
import ImageCropper from '../../widgets/imageCropper/imageCropper';

const channelGlobal = Radio.channel('global');

const NewTeamView = BaseModalView.extend({
  template: require('../../../templates/modals/imageCropper.hbs'),

  regions: {
    imageRegion: '.js-imageRegion'
  },

  initialize(options) {
    this.options = options;
  },

  onRender() {
    this.showCropper(this.options.image);
  },

  submit() {
    this.cropper.getCroppedImage()
      .then((image) => {
        channelGlobal.trigger('modal:imageCropped', image);
        channelGlobal.trigger('modal:close');
      });
  },

  showCropper(file) {
    this.cropper = null;
    this.cropper = new ImageCropper({ file });
    this.showChildView('imageRegion', this.cropper);
    this.cropper.on('cropper:cancel', this.close.bind(this));
  }
});

export default NewTeamView;
