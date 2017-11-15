/**
 * Created by pavluhin on 26.09.2017.
 */


import Marionette from 'backbone.marionette';
import Seasons from '../../entities/seasons';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import BaseModalView from './baseModal';
import MeetingStructure from './components/meetingStructure';

const channelGlobal = Radio.channel('global');

const NewSeasonView = BaseModalView.extend({
  template: require('../../../templates/modals/newSeason.hbs'),
  // regions: {
  //   meetingStructure: '.js-structureRegion'
  // },

  initialize(options) {
    this.options = options;
    this.collection = new Seasons();
    this.model = new this.collection.model();
  },

  onRender() {
    const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);
    // this.showChildView('meetingStructure', new MeetingStructure());
  },

  submit() {
    this.collection.add(this.model);
    this.model.save()
      .then((result) => {
        channelGlobal.request('navigate', `season/${this.model.id}`, { trigger: true, replace: true });
        channelGlobal.trigger('season:created');
        channelGlobal.trigger('modal:close');
      })
      .catch((err) => {
        console.error(err);
      });
  }
});

export default NewSeasonView;
