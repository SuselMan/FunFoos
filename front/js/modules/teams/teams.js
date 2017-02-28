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

const TeamsView = Marionette.CollectionView.extend({
    childView: TeamView,
    emptyView: EmptyView
});

const NewTeam = Marionette.View.extend({
    template: require('../../../templates/teams/newTeam.hbs'),
});

const TeamsLayout = Marionette.View.extend({
    template: require('../../../templates/teams/teams.hbs'),
    collection: new Teams(),
    behaviors: [Preloader],
    regions: {
        listRegion: {
            el: '.js-listRegion'
        },
        addTeamRegion: '.js-newTeamRegion'
    },

    onRender:function(){
        this.collection.fetch()
            .then(function(){
                console.log('done');
                this.showChildView('listRegion', new TeamsView({
                    collection: this.collection
                }));
                this.showChildView('addTeamRegion', new NewTeam({

                }));
                this.triggerMethod('fetch:complete');
            }.bind(this))
            .catch(function(e){
                console.log('fuck',e);
            })
    }
});

export default TeamsLayout;