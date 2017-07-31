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

  initialize: function(options){
    this.options = options;
    console.log('HEY!');
  },

  onRender:function(){
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
    this.model.updateSignin()
      .then(function (result) {
        channelGlobal.trigger("done:signin", this.model);
      }.bind(this))
      .catch(function (e) {

      })
  }
});

export default LoginView;