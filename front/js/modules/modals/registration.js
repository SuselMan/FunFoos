/**
 * Created by pavluhin on 26.07.2017.
 */


import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import BaseModalView from './baseModal';

const channelGlobal = Radio.channel('global');

export default BaseModalView.extend({
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
      .then(() => {
        channelGlobal.trigger('done:signup', this.model);
      })
      .catch(() => {
        // TODO: throw error
      });
  },

  fetch() {
    this.model.updateSignin()
      .then(() => {
        channelGlobal.trigger('done:signin', this.model);
      })
      .catch(() => {
        // TODO: throw error
      });
  }
});
