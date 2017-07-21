/**
 * Created by ilya on 08.03.2017.
 */

"use strict";


import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Teams from '../../entities/teams';
import Players from '../../entities/players';
import Meetings from '../../entities/meetings';
import Places from '../../entities/places'
import ProtocolView from './protocol';

let channelGlobal = Radio.channel('global');

const MeetingLayout = Marionette.View.extend({
  template: require('../../../templates/meeting/meeting.hbs'),
  collection: new Meetings(),
  className: 'container team-layout',

  ui: {
    selectPlaceBtn: '.js-name'
  },
  events: {
    'click @ui.selectPlaceBtn': 'callPlaceSelector'
  },

  regions: {
    protocolRegion: '.js-protocolRegion'
  },

  initialize: function (options) {
    this.options = options;
    this.model = new this.collection.model({_id: this.options.id});
    this.model.fetch().then(this.showMeeting.bind(this));
  },

  onRender: function () {
    var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);
  },

  callPlaceSelector: function () {
    this.places.fetch()
      .then(() => {
        channelGlobal.trigger('modal:show', {view: 'placeSelector', collection: this.places});
        channelGlobal.on('place:selected', this.changePlace.bind(this));
      })
  },

  changePlace:function(model){
    this.model.save({place:model.id})
      .then(()=>{
        this.setPlace();
      })
  },

  setPlace: function(){
    var place = this.places.get(this.model.get('place')).toJSON();
    this.model.set('placeName', place.name);
    this.model.set('placeImage', place.image);
    this.el.querySelector('.js-placeImage').src =  place.image;
  },

  showMeeting: function () {
    var teams = new Teams();
    this.places = new Places();
    //TODO: refactor;
    Promise.all([teams.fetch(), this.places.fetch()])
      .then(function () {
        this.model.set('hostTeam', teams.get(this.model.get('host')).toJSON());
        this.model.set('guestTeam', teams.get(this.model.get('guest')).toJSON());
        this.model.set('hostName', this.model.get('hostTeam').name);
        this.model.set('guestName', this.model.get('guestTeam').name);
        this.model.set('hostLogo', this.model.get('hostTeam').image || '');
        this.model.set('guestLogo', this.model.get('guestTeam').image || '');
        if (this.model.get('place')) {
          this.setPlace();
        } else {
          this.model.set('placeName', 'Выбрать место');
        }
        this.render();
        this.showChildView('protocolRegion', new ProtocolView({
          model: this.model
        }));
      }.bind(this));
  }
});


export default MeetingLayout;