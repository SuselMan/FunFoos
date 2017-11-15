/**
 * Created by pavluhin on 26.09.2017.
 */

import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Seasons from '../../entities/seasons';
import BaseModalView from './baseModal';

const channelGlobal = Radio.channel('global');

const NewSeasonView = BaseModalView.extend({
  template: require('../../../templates/modals/newSeason.hbs'),

  initialize(options) {
    this.options = options;
    this.collection = new Seasons();
    this.model = new this.collection.model();
  },

  onRender() {
    const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);
  },

  submit() {
    this.collection.add(this.model);
    this.model.save()
      .then(() => {
        channelGlobal.request('navigate', `season/${this.model.id}`, { trigger: true, replace: true });
        channelGlobal.trigger('season:created');
        channelGlobal.trigger('modal:close');
      })
      .catch(() => {
        // TODO: throw error
      });
  }
});

export default NewSeasonView;
