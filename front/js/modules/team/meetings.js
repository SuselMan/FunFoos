/**
 * Created by pavluhin on 31.03.2017.
 */


"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Meetings from '../../entities/meetings';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Preloader from '../../behaviors/preloader';
import moment from 'moment';

let channelGlobal = Radio.channel('global');


const MeetingView = Marionette.View.extend({
    template: require('../../../templates/team/meeting.hbs'),
    tagName: 'div',
    className: 'team-player',

    ui: {
        deleteBtn: '.js-deleteBtn'
    },

    events: {
        'click @ui.deleteBtn': 'deleteMeeting',
        'click': 'navigate'
    },

    initialize: function (options) {
        this.options = options;
        let id;
        console.log('owner', options);
        id = options.owner === this.model.get('host') ? this.model.get('guest') : this.model.get('host');
        console.log('team', this.options.teamsCollection.get(id));
        let name = this.options.teamsCollection.get(id).get('name');
        let image = this.options.teamsCollection.get(id).get('image');
        this.model.set('name',name);
        this.model.set('image',image);
        this.model.set('time',moment(moment.unix(this.model.get('date')), "YYYYMMDD").fromNow());
        console.log('id', id);
    },

    deleteMeeting: function (e) {
        e.stopPropagation();
        this.model.destroy();
    },

    navigate: function () {
        channelGlobal.request('navigate', 'meeting/' + this.model.id, {trigger: true, replace: true});
    },

    onRender: function () {
        var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);
    }
});

const EmptyView = Marionette.View.extend({
    template: require('../../../templates/team/emptyMeetings.hbs'),
    tagName: 'div'

    // className: 'list-group-item',
});

const MeetingsView = Marionette.CollectionView.extend({
    childView: MeetingView,
    emptyView: EmptyView,
    className: 'col-12 team-players-container',

    initialize: function (options) {
        this.options = options;
        this.childViewOptions = options;
    }
});

const MeetingsLayout = Marionette.View.extend({
    template: require('../../../templates/team/meetings.hbs'),
    collection: new Meetings(),
    behaviors: [Preloader],

    ui: {
        //createMeetingBtn: ".js-createMeeting"
    },

    events: {
        'click @ui.createMeetingBtn': 'createMeeting'
    },

    regions: {
        listRegion: {
            el: '.js-listRegion'
        }
    },

    initialize: function (options) {
        this.options = options;
    },

    fetchMeetings: function () {
        return this.collection.fetch({data: {owner: this.options.owner}});
    },

    onRender: function () {
        this.fetchMeetings()
            .then(function () {
                this.showChildView('listRegion', new MeetingsView({
                    collection: this.collection,
                    teamsCollection: this.options.teamsCollection,
                    owner: this.options.owner
                }));
                this.triggerMethod('fetch:complete');
            }.bind(this))
            .catch(function (err) {
                console.error(err);
            })
    }
});

export default MeetingsLayout;