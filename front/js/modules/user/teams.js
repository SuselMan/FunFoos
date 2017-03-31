/**
 * Created by pavluhin on 31.03.2017.
 */


"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Teams from '../../entities/teams';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Preloader from '../../behaviors/preloader';

let channelGlobal = Radio.channel('global');


const TeamView = Marionette.View.extend({
    template: require('../../../templates/user/team.hbs'),
    tagName:'li',
    className: 'list-group-item',

    events:{
        'click': 'navigate'
    },
    navigate:function(){
        channelGlobal.request('navigate', 'team/'+this.model.id, {trigger: true, replace: true});
    },

    onRender:function () {
        var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);
    }
});

const EmptyView = Marionette.View.extend({
    template: require('../../../templates/user/empty.hbs'),
    tagName:'li',
    className: 'list-group-item',
});

const TeamsView = Marionette.CollectionView.extend({
    childView: TeamView,
    emptyView: EmptyView
});

const TeamsLayout = Marionette.View.extend({
    template: require('../../../templates/teams/teams.hbs'),
    collection: new Teams(),
    behaviors: [Preloader],
    regions: {
        listRegion: {
            el: '.js-listRegion'
        }
    },

    initialize: function(options){
        this.options = options;
    },

    onRender: function(){
        this.collection.fetch({data: {owner: this.options.owner}})
            .then(function(){
                this.showChildView('listRegion', new TeamsView({
                    collection: this.collection
                }));
                this.triggerMethod('fetch:complete');
            }.bind(this))
            .catch(function(err){
                console.error(err);
            })
    }
});

export default TeamsLayout;