/**
 * Created by pavluhin on 24.07.2017.
 */

// TODO: move it to another directory like 'helpers'


import Backbone from 'backbone';

const File = Backbone.Model.extend({
  idAttribute: '_id',
  urlRoot: '/api/files',

  initialize(attrs, options) {
    this.options = options;
  },

  saveImage() {
    if (this.get('blob')) {
      const formData = new FormData();
      formData.append('imageFiles', this.get('blob'), 'image.png');
      return fetch(this.urlRoot, {
        method: 'POST',
        body: formData
      });
    }
    return null;
  }
});

export default File;
