/**
 * Created by pavluhin on 31.03.2017.
 */

import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Teams from '../../entities/teams';
import BaseModalView from './baseModal';

const channelGlobal = Radio.channel('global');

const NewTeamView = BaseModalView.extend({
  template: require('../../../templates/modals/newTeam.hbs'),

  initialize(options) {
    this.options = options;
    this.collection = new Teams();
    this.model = new this.collection.model();
    this.model.set('owner', options.user.id);
  },

  onRender() {
    const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);
  },

  submit() {
    this.collection.add(this.model);
    this.model.save()
      .then(() => {
        channelGlobal.trigger('team:created');
        channelGlobal.trigger('modal:close');
      })
      .catch(() => {
        // TODO:throw error;
      });
  }
});

export default NewTeamView;
