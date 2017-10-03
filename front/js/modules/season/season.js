/**
 * Created by pavluhin on 03.10.2017.
 */

"use strict";


import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Seasons from '../../entities/seasons';
import moment from 'moment';

let channelGlobal = Radio.channel('global');

const MeetingLayout = Marionette.View.extend({
  template: require('../../../templates/season/season.hbs'),
  collection: new Seasons(),
  className: 'container big-header-layout',

  ui: {
    dateSelector: '.js-date'
  },

  events: {
    'click @ui.dateSelector': 'showDateSelector'
  },

  regions: {
    subSeasonsRegion: '.js-subSeasonsRegion'
  },

  initialize: function (options) {
    this.options = options;
    this.model = new this.collection.model({_id: this.options.id});
    this.model.fetch();
  },

  onRender: function () {
    var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);

    let date = this.model.get('date');
    console.log('Model', this.model);
    console.log('date', date);
    console.log('el', this.el.querySelector('.js-date'));
    console.log('moment', moment.unix(date).format("DD MMMM YYYY, hh:mm:ss"));
    if (date) {
      this.el.querySelector('.js-date').textContent = moment.unix(date).format("DD MMMM YYYY, hh:mm:ss");
      console.log('el', this.el.querySelector('.js-date'));
    }
  },

  showDateSelector: function() {
    console.log('showDateSelector');
    channelGlobal.trigger('modal:show', {view: 'dateSelector', collection: this.places});
  }
});


export default MeetingLayout;