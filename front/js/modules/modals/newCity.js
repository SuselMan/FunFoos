/**
 * Created by pavluhin on 07.10.2017.
 */

"use strict";

import Marionette from 'backbone.marionette';
import Cities from '../../entities/cities';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import BaseModalView from './baseModal'
import UploadView from '../../widgets/fileUploader/fileUploader';
import ImageCropper from '../../widgets/imageCropper/imageCropper';

let channelGlobal = Radio.channel('global');

const ImageView = Marionette.View.extend({
  template: require('../../../templates/modals/image.hbs')
});

const NewCityView = BaseModalView.extend({
  template: require('../../../templates/modals/newCity.hbs'),

  regions: {
    imageRegion: '.js-imageRegion'
  },

  initialize: function (options) {
    this.options = options;
    this.collection = new Cities();
    this.model = new this.collection.model();
    channelGlobal.off('image:selected');
  },

  onRender: function () {
    var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);

    if (this.model.get('image')) {
      this.showChildView('imageRegion', new ImageView({model: this.model}));
    } else {
      this.showUploader();
    }
  },

  submit: function () {
    this.cropper.getCroppedImage()
      .then((image)=> {
        this.model.set('image', image);
        this.collection.add(this.model);
        this.model.save()
          .then(function () {
            channelGlobal.trigger('player:created');
            channelGlobal.trigger('modal:close');
          }.bind(this))
          .catch(function (err) {
            console.error(err);
          })
      })
  },

  showUploader: function () {
    this.uploadView = null;
    this.uploadView = new UploadView();
    this.showChildView('imageRegion', this.uploadView);
    channelGlobal.on('image:selected', this.showCropper, this);
  },

  showCropper: function (file) {
    this.cropper = null;
    this.cropper = new ImageCropper({file: file});
    this.showChildView('imageRegion', this.cropper);
    this.cropper.on('cropper:cancel', this.showUploader.bind(this));
  },

  showImage: function (url) {
    this.model.set('image', url);
    this.showChildView('imageRegion', new ImageView({model: this.model}));
  }
});

export default NewCityView;