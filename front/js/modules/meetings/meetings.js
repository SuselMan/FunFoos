"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Meetings from '../../entities/meetings';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Preloader from '../../behaviors/preloader';

import Teams from '../../entities/teams';
import Places from '../../entities/places'
import moment from 'moment';

let channelGlobal = Radio.channel('global');

const MeetingView = Marionette.View.extend({
  template: require('../../../templates/meetings/meeting.hbs'),
  tagName: 'li',
  className: 'list-group-item',
  ui: {
    //name: '.name',
    //image: '.image'
  },

  events: {
    //'click @ui.name': 'navigateToTeam',
  },

  initialize: function (options) {
    this.options = options;
    this.hostTeam = this.options.teams.get(this.model.get('host')).get('name');
    this.guestTeam = this.options.teams.get(this.model.get('guest')).get('name');
    this.model.set('hostTeam',  this.hostTeam);
    this.model.set('guestTeam',  this.guestTeam);
    let date = this.model.get('date');
    if(date){
      this.model.set('date', moment.unix(date , "YYYYMMDD").fromNow());
    } else {
      this.model.set('date', '—');
    }

  },

  onRender: function () {
    let bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);
    console.log('this.hostTeam ',this.hostTeam );

    let hostImage = this.options.teams.get(this.model.get('host')).get('image');
    if (hostImage) {
      this.el.querySelector('.hostImage').setAttribute('style', 'background-image:url(' + hostImage + ')');
    }
    let guestImage = this.options.teams.get(this.model.get('guest')).get('image');
    if (guestImage) {
      this.el.querySelector('.guestImage').setAttribute('style', 'background-image:url(' + guestImage + ')');
    }

  },

  navigateToTeam: function () {
    // channelGlobal.request('navigate', 'team/' + this.model.id, {trigger: true, replace: true});
  }
});

const EmptyView = Marionette.View.extend({
  template: require('../../../templates/meetings/empty.hbs'),
  tagName: 'li',
  className: 'list-group-item',
});

const MeetingsView = Marionette.CollectionView.extend({
  childView: MeetingView,
  emptyView: EmptyView,
  initialize: function (options) {
    this.childViewOptions = options;
  }
});


const MeetingsLayout = Marionette.View.extend({
  template: require('../../../templates/meetings/meetings.hbs'),
  className: 'container meetings',
  collection: new Meetings(),
  behaviors: [Preloader],
  regions: {
    listRegion: {
      el: '.js-listRegion'
    }
  },

  onRender: function () {
    this.teams = new Teams();
    this.places = new Places();
    Promise.all([
      this.teams.fetch(),
      this.places.fetch(),
      this.collection.fetch()
    ])
      .then(function () {
        this.showChildView('listRegion', new MeetingsView({
          collection: this.collection,
          teams: this.teams,
          places: this.places
        }));
        this.triggerMethod('fetch:complete');
      }.bind(this))
      .catch(function (e) {
        //TODO: notification
      })
  }
});

export default MeetingsLayout;