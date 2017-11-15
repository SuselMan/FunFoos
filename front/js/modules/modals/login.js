/**
 * Created by pavluhin on 26.07.2017.
 */


import Marionette from 'backbone.marionette';
import Teams from '../../entities/teams';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import BaseModalView from './baseModal';

const channelGlobal = Radio.channel('global');

const LoginView = BaseModalView.extend({
  template: require('../../../templates/modals/login.hbs'),

  initialize(options) {
    this.options = options;
  },

  onRender() {
    const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);
  },

  submit() {
    this.model.signin()
      .then((result) => {
        channelGlobal.trigger('done:signin', this.model);
      })
      .catch((e) => {

      });
  },

  fetch() {
    return new Promise((resolve) => {
      this.model.updateSignin()
        .then((result) => {
          channelGlobal.trigger('done:signin', this.model);
          resolve(this.model);
        })
        .catch((e) => {
          resolve(null);
        });
    });
  }
});

export default LoginView;
