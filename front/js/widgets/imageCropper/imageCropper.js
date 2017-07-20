/**
 * Created by pavluhin on 20.07.2017.
 */


import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import Cropper from 'cropperjs'

let channelGlobal = Radio.channel('global');


const ImageCropper = Marionette.View.extend({
  template: require('./imageCropper.hbs'),
  className: 'image-cropper',

  ui:{
    delete:'.js-delete'
  },
  events: {
    'click @ui.delete': 'delete'
  },

  initialize: function (options) {
    this.options = options;
    console.log('options', options);
  },

  onRender: function () {
    if (FileReader) {
      var fr = new FileReader();
      fr.onload = function () {
        document.getElementById('testImage').src = fr.result;
        var image = document.getElementById('testImage');
        var cropper = new Cropper(image, {
          aspectRatio: 1,
          viewMode: 1,
          background: false,
          movable: false,
          rotatable: false,
          scalable: false,
          zoomable:false,
          crop: function(e) {
            console.log(e.detail.x);
            console.log(e.detail.y);
            console.log(e.detail.width);
            console.log(e.detail.height);
            console.log(e.detail.rotate);
            console.log(e.detail.scaleX);
            console.log(e.detail.scaleY);
          }
        });
      }
      fr.readAsDataURL(this.options.file);
    }
  },

  delete: function () {
    this.trigger('cropper:cancel')
  }

});

export default ImageCropper;