/**
 * Created by pavluhin on 20.07.2017.
 */


import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import Cropper from 'cropperjs';
import File from '../../entities/files';

const channelGlobal = Radio.channel('global');


const ImageCropper = Marionette.View.extend({
  template: require('./imageCropper.hbs'),
  className: 'image-cropper',

  ui: {
    delete: '.js-delete'
  },
  events: {
    'click @ui.delete': 'delete'
  },

  initialize(options) {
    this.options = options;
  },

  onRender() {
    if (FileReader) {
      const fr = new FileReader();
      fr.onload = function () {
        document.getElementById('testImage').src = fr.result;
        const image = document.getElementById('testImage');
        this.cropper = new Cropper(image, {
          aspectRatio: 1,
          viewMode: 1,
          background: false,
          movable: false,
          rotatable: false,
          scalable: false,
          zoomable: false,
          crop(e) {
            // TODO: remove this callback if we will not find to reason for it;
          }
        });
      }.bind(this);
      fr.readAsDataURL(this.options.file);
    }
  },

  getCroppedImage() {
    return new Promise(((resolve, reject) => {
      if (this.cropper) {
        this.cropper.getCroppedCanvas({
          width: 400,
          height: 400
        }).toBlob((blob) => {
          const image = new File({ blob });
          image.saveImage().then(res => res.json())
            .then((res) => {
              resolve(res);
            });
        });
      } else {
        reject({ msg: 'Cropper is not defined' });
      }
    }));
  },

  delete() {
    this.trigger('cropper:cancel');
  }

});

export default ImageCropper;
