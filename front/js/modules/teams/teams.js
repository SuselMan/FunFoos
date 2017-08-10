/**
 * Created by pavluhin on 28.02.2017.
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
    template: require('../../../templates/teams/team.hbs'),
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

const EmptyView = Marionette.View.extend({
    template: require('../../../templates/teams/empty.hbs'),
    tagName: 'li',
    className: 'list-group-item',
});

const TeamsView = Marionette.CollectionView.extend({
    childView: TeamView,
    emptyView: EmptyView
});

const TeamsLayout = Marionette.View.extend({
    template: require('../../../templates/teams/teams.hbs'),
    className: 'container teams',
    collection: new Teams(),
    behaviors: [Preloader],
    regions: {
        listRegion: {
            el: '.js-listRegion'
        },
        addTeamRegion: '.js-newTeamRegion'
    },

    onRender: function () {
        this.collection.fetch()
            .then(function () {
                this.showChildView('listRegion', new TeamsView({
                    collection: this.collection
                }));
                // this.showChildView('addTeamRegion', new NewTeam({
                //   collection: this.collection
                // }));
                this.triggerMethod('fetch:complete');
            }.bind(this))
            .catch(function (err) {
                console.error(err);
            })
    }
});

export default TeamsLayout;