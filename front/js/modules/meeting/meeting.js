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

let channelGlobal = Radio.channel('global');

const ProtocolView = Marionette.View.extend({
    template: require('../../../templates/meeting/protocol.hbs'),
    className: 'protocol',

    initialize: function (options) {
        console.log('lol');
        console.log('this.model', this.model.toJSON());
        this.options = options;
    },

    onRender: function () {
        console.log('2sqaxd', this.el);
    },
});

const MeetingLayout = Marionette.View.extend({
    template: require('../../../templates/meeting/meeting.hbs'),
    collection: new Meetings(),
    className: 'container team-layout',

    regions: {
        protocolRegion: '.js-protocolRegion'
    },

    initialize: function (options) {
        this.options = options;
        this.model = new this.collection.model({_id: this.options.id});
        this.model.fetch().then(this.showMeeting.bind(this));
    },

    onRender: function () {
        this.showChildView('protocolRegion', new ProtocolView({
            model: this.model
        }));
    },

    showMeeting: function () {
        var teams = new Teams();
        var places = new Places();
        //TODO: refactor;
        teams.fetch()
            .then(function () {
                this.model.set('hostTeam', teams.get(this.model.get('host')).toJSON());
                this.model.set('guestTeam', teams.get(this.model.get('guest')).toJSON());
                this.model.set('hostName', this.model.get('hostTeam').name);
                this.model.set('guestName', this.model.get('guestTeam').name);
                this.model.set('hostLogo', this.model.get('hostTeam').image);
                this.model.set('guestLogo', this.model.get('guestTeam').image);
            }.bind(this));
        places.fetch()
            .then(function () {
                var place = places.get(this.model.get('place')).toJSON();
                this.model.set('placeName', place.name);
                this.model.set('placeImage', place.image);
                this.render();
            }.bind(this));
    },
});


export default MeetingLayout;