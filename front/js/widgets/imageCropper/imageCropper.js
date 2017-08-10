/**
 * Created by pavluhin on 20.07.2017.
 */


import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import Cropper from 'cropperjs'
import File from '../../entities/files';

let channelGlobal = Radio.channel('global');


const ImageCropper = Marionette.View.extend({
  template: require('./imageCropper.hbs'),
  className: 'image-cropper',

  ui: {
    delete: '.js-delete'
  },
  events: {
    'click @ui.delete': 'delete'
  },

  initialize: function (options) {
    this.options = options;
  },

  onRender: function () {
    if (FileReader) {
      var fr = new FileReader();
      fr.onload = function () {
        document.getElementById('testImage').src = fr.result;
        var image = document.getElementById('testImage');
        this.cropper = new Cropper(image, {
          aspectRatio: 1,
          viewMode: 1,
          background: false,
          movable: false,
          rotatable: false,
          scalable: false,
          zoomable: false,
          crop: function (e) {
            //TODO: remove this callback if we will not find to reason for it;
          }
        });
      }.bind(this);
      fr.readAsDataURL(this.options.file);
    }
  },

  getCroppedImage: function () {
    return new Promise(function (resolve, reject) {
      if (this.cropper) {
        this.cropper.getCroppedCanvas({
          width: 400,
          height: 400
        }).toBlob((blob) => {
          var image = new File({blob: blob});
          image.saveImage().then((res)=> {
            return res.json()
          })
            .then((res)=> {
              resolve(res);
            })
        })
      } else {
        reject({msg: 'Cropper is not defined'});
      }
    }.bind(this))
  },

  delete: function () {
    this.trigger('cropper:cancel')
  }

});

export default ImageCropper;