/**
 * Created by pavluhin on 11.10.2017.
 */


import Marionette from 'backbone.marionette';
import Divisions from '../../entities/divisions';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import BaseModalView from './baseModal';
import MeetingStructure from './components/meetingStructure';

const channelGlobal = Radio.channel('global');

const NewSeasonView = BaseModalView.extend({
  template: require('../../../templates/modals/newDivision.hbs'),
  regions: {
    meetingStructure: '.js-structureRegion'
  },

  initialize(options) {
    this.options = options;
    this.collection = new Divisions();
    this.model = new this.collection.model();
    this.model.set('season', options.subseason.season);
    this.model.set('subseason', options.subseason._id);
  },

  onRender() {
    const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);
    this.showChildView('meetingStructure', new MeetingStructure());
  },

  submit() {
    this.collection.add(this.model);
    this.model.save()
      .then((result) => {
        channelGlobal.trigger('division:created');
        channelGlobal.trigger('modal:close');
      })
      .catch((err) => {
        console.error(err);
      });
  }
});

export default NewSeasonView;
