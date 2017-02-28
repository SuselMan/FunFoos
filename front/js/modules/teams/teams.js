/**
 * Created by pavluhin on 28.02.2017.
 */

"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Teams from '../entities/teams';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Preloader from '../../behaviors/preloader';

let channelGlobal = Radio.channel('global');


const TeamView = Marionette.View.extend({
    template: require('../../../templates/teams/team.hbs'),
    tagName:'li',
    className: 'list-group-item',
    onRender:function () {
        var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);
    }
});

const EmptyView = Marionette.View.extend({
    template: require('../../../templates/teams/empty.hbs'),
    tagName:'li',
    className: 'list-group-item',
});

const TeamsView = Marionette.CompositeView.extend({
    template: require('../../../templates/teams/teams.hbs'),
    className: 'myclass',
    collection: new Teams(),
    childView: TeamView,
    emptyView: EmptyView,
    childViewContainer: ".js-teams",
    behaviors: [Preloader],

    initialize:function(){
        this.collection.fetch()
            .then(function(){
                console.log('done');
                this.render();
                this.trigger('load:comlete');
            }.bind(this))
            .catch(function(){
                console.log('fuck');
            })
    },

    onRender: function() {
        console.log('render');
        console.log('coll',this.collection);
    }
});


export default TeamsView;