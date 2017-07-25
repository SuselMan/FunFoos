/**
 * Created by pavluhin on 24.07.2017.
 */

// TODO: move it to another directory like 'helpers'

'use strict';

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

const File = Backbone.Model.extend({
  idAttribute: "_id",
  urlRoot: 'api/files',

  initialize: function (attrs, options) {
    this.options = options;
  },

  saveImage: function () {
    if(this.model.get('blob')){
      var formData = new FormData();
      formData.append('croppedImage', this.model.get('blob'));
      return fetch(this.urlRoot, {
        headers: {'Content-Type': 'application/json'},
        method: 'post',
        body: formData
      });
    }
  }
});

export default File;
