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
  template: require('../../../templates/modals/registration.hbs'),

  initialize(options) {
    this.options = options;
  },

  onRender() {
    const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);
  },

  submit() {
    this.model.signup()
      .then(function (result) {
        channelGlobal.trigger('done:signup', this.model);
      })
      .catch((e) => {

      });
  },

  fetch() {
    this.model.updateSignin()
      .then((result) => {
        channelGlobal.trigger('done:signin', this.model);
      })
      .catch((e) => {

      });
  }
});

export default LoginView;
