/**
 * Created by pavluhin on 11.08.2017.
 */

"use strict";

import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
let channelGlobal = Radio.channel('global');


const FilterView = Marionette.View.extend({
  template: require('../../../templates/teams/filter.hbs'),
  tagName: 'li',
  className: 'list-group-item',
  ui: {
    name: '.name',
    image: '.image'
  },

  events: {
    'click @ui.name': 'navigateToTeam',
  },

  onRender: function () {
    let bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);

    let image = this.model.get('image');
    if (image) {
      this.el.querySelector('.image').setAttribute('style', 'background-image:url(' + image + ')');
    } else {
      this.el.querySelector('.image').setAttribute('style', '');
    }
  },

  navigateToTeam: function () {
    channelGlobal.request('navigate', 'team/' + this.model.id, {trigger: true, replace: true});
  }
});

export default FilterView;