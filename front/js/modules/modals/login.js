/**
 * Created by pavluhin on 26.07.2017.
 */

"use strict";

import Marionette from 'backbone.marionette';
import Teams from '../../entities/teams';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import BaseModalView from './baseModal'

let channelGlobal = Radio.channel('global');

const LoginView = BaseModalView.extend({
  template: require('../../../templates/modals/login.hbs'),

  initialize: function (options) {
    this.options = options;
  },

  onRender: function () {
    var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);
  },

  submit: function () {
    this.model.signin()
      .then(function (result) {
        channelGlobal.trigger("done:signin", this.model);
      }.bind(this))
      .catch(function (e) {

      })
  },

  fetch: function () {
    return new Promise((resolve) => {
      this.model.updateSignin()
        .then((result) => {
          channelGlobal.trigger("done:signin", this.model);
          resolve(this.model);
        })
        .catch(function (e) {
          resolve(null);
        })
    })
  }
});

export default LoginView;