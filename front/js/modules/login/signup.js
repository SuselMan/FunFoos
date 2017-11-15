/**
 * Created by pavluhin on 28.02.2017.
 */


import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';

const channelGlobal = Radio.channel('global');

export default Marionette.View.extend({
  template: require('../../../templates/login/signup.hbs'),
  className: 'form-inline header-form',
  tagName: 'div',

  ui: {
    saveBtn: '.js-save'
  },

  events: {
    'click @ui.saveBtn': 'save'
  },

  onRender() {
    const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);
  },

  save() {
    this.model.signup()
      .then(() => {
        channelGlobal.trigger('done:signup', this.model);
      })
      .catch(() => {
        // TODO: throw error
      });
  }

});
