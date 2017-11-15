/**
 * Created by ilya on 03.03.2017.
 */


import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

const channelGlobal = Radio.channel('global');


// TODO: refactor

const UploaderView = Marionette.View.extend({
  template: require('./fileUploader.hbs'),
  className: 'upload-form',

  onRender() {
    this.el.addEventListener('dragover', (event) => {
      this.el.classList.add('drop');
      event.preventDefault();
    }, false);

    this.el.addEventListener('dragleave', (event) => {
      this.el.classList.remove('drop');
      event.preventDefault();
    }, false);

    this.el.addEventListener('drop', this.uploadImage.bind(this));
    this.el.querySelector('#file-upload').addEventListener('change', this.uploadImage.bind(this));
  },

  uploadImage(event) {
    event.preventDefault();
    const files = event.target.files || event.dataTransfer.files;
    channelGlobal.trigger('image:selected', files[0]);
    this.el.classList.remove('drop');
  }
});

export default UploaderView;
