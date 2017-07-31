/**
 * Created by pavluhin on 24.07.2017.
 */

// TODO: move it to another directory like 'helpers'

'use strict';

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

const File = Backbone.Model.extend({
  idAttribute: "_id",
  urlRoot: '/api/files',

  initialize: function (attrs, options) {
    this.options = options;
  },

  saveImage: function () {
    if(this.get('blob')){
      var formData = new FormData();
      formData.append('imageFiles', this.get('blob'), 'image.png');
      return fetch(this.urlRoot, {
        method: 'POST',
        body: formData
      });
    }
  }
});

export default File;
