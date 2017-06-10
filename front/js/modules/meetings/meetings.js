"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Meetings from '../../entities/meetings';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Preloader from '../../behaviors/preloader';

let channelGlobal = Radio.channel('global');


const MeetingView = Marionette.View.extend({
    template: require('../../../templates/meetings/meeting.hbs'),
    tagName:'li',
    className: 'list-group-item',
    onRender:function () {
        var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);
    }
});

const EmptyView = Marionette.View.extend({
    template: require('../../../templates/meetings/empty.hbs'),
    tagName:'li',
    className: 'list-group-item',
});

const MeetingsView = Marionette.CollectionView.extend({
    childView: MeetingView,
    emptyView: EmptyView
});

const NewMeeting = Marionette.View.extend({
    template: require('../../../templates/meetings/newMeeting.hbs'),
    ui:{
        saveBtn: ".js-addMeetingBtn",
    },

    events: {
        'click @ui.saveBtn': 'save'
    },

    initialize: function () {
        this.model= new this.collection.model();
    },

    onRender:function(){
        var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);
    },

    save: function () {
        this.collection.add(this.model);
        this.model.save()
            .then(function (result) {

            })
            .catch(function (e) {

            })


    },
});

const MeetingsLayout = Marionette.View.extend({
    template: require('../../../templates/meetings/meetings.hbs'),
    collection: new Meetings(),
    behaviors: [Preloader],
    regions: {
        listRegion: {
            el: '.js-listRegion'
        },
        addMeetingRegion: '.js-newMeetingRegion'
    },

    onRender:function(){
        this.collection.fetch()
            .then(function(){
                this.showChildView('listRegion', new MeetingsView({
                    collection: this.collection
                }));
                this.showChildView('addMeetingRegion', new NewMeeting({
                    collection: this.collection
                }));
                this.triggerMethod('fetch:complete');
            }.bind(this))
            .catch(function(e){
                
            })
    }
});

export default MeetingsLayout;