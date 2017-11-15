/**
 * Created by pavluhin on 15.11.2017.
 */


"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import Teams from '../../entities/teams';
import Meetings from '../../entities/meetings';

let channelGlobal = Radio.channel('global');

const MeetingsTableItem = Backbone.Model.extend({
    defaults: {
        meetings: null
    },
})

const MeetingsTableCollection = Backbone.Collection.extend({
    model: MeetingsTableItem
});

const MeetingsItem = Marionette.View.extend({
    template: require('../../../templates/subseason/meetings/tableItem.hbs'),
    className: 'tableItem',
    onRender: function () {
        const basis = this.model.get('basis');
        this.el.setAttribute('style', `flex-basis:${basis}%`);
        if(this.model.get('meetings')){
            this.el.style.backgroundColor = "blue";
            if(!this.model.get('meetings').length){
                this.el.style.backgroundColor = "grey";
            }
        }
        if(!this.model.get('meetings') && !this.model.get('team')){
            this.el.style.backgroundColor = "grey";
        }
    }
});

const MeetingsTable = Marionette.CollectionView.extend({
    childView: MeetingsItem,
    className: 'meetings-table',
    initialize: function () {
        console.log('initialize MeetingsTable');
        this.render();
    }
});

export default Marionette.View.extend({
    template: require('../../../templates/subseason/meetings/meetings.hbs'),
    tagName: 'div',
    className: 'test',
    regions: {
        meetingsTableRegion: '.js-meetingsTableRegion'
    },

    initialize: function (options) {
        this.options = options;
        this.teams = options.teams;
        this.meetings = options.meetings;
        this.generateMeetingsCollection();
        this.render();
    },

    onRender: function () {
        console.log('HEY BRO', this.meetingsColl);
        this.showChildView('meetingsTableRegion', new MeetingsTable({collection: this.meetingsColl}));
    },

    generateMeetingsCollection: function () {
        this.meetingsColl = new MeetingsTableCollection();
        const basis = Math.floor(100 / (this.teams.length + 1));
        this.meetingsColl.add(new MeetingsTableItem({basis}));
        this.teams.forEach((team) => {
            this.meetingsColl.add(new MeetingsTableItem({basis, team: team}));
        });
        this.teams.forEach((team1) => {
            this.meetingsColl.add(new MeetingsTableItem({basis, team: team1}));
            this.teams.forEach((team2) => {
                const item = new MeetingsTableItem();
                const meetings = this.meetings.where({host: team1.id, guest: team2.id});
                this.meetingsColl.add(new MeetingsTableItem({meetings, basis}));
            });
        })
    }
});