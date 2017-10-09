/**
 * Created by pavluhin on 08.10.2017.
 */


"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Seasons from '../../entities/seasons';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Preloader from '../../behaviors/preloader';

let channelGlobal = Radio.channel('global');


const SeasonView = Marionette.View.extend({
    template: require('../../../templates/seasons/season.hbs'),
    tagName: 'div',
    className: 'flex-card',
    ui: {
        name: '.name',
        image: '.image'
    },

    events: {
        'click': 'navigateToSeason',
    },

    onRender: function () {
        let bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);
    },

    navigateToSeason: function () {
        channelGlobal.request('navigate', 'season/' + this.model.id, {trigger: true, replace: true});
    }
});

const EmptyView = Marionette.View.extend({
    template: require('../../../templates/seasons/empty.hbs'),
    tagName: 'li',
    className: 'list-group-item',
});

const SeasonsView = Marionette.CollectionView.extend({
    childView: SeasonView,
    emptyView: EmptyView,
    className:'list'
});

const SeasonsLayout = Marionette.View.extend({
    template: require('../../../templates/seasons/seasons.hbs'),
    className: 'container seasons',
    collection: new Seasons(),
    behaviors: [Preloader],
    regions: {
        listRegion: {
            el: '.js-listRegion'
        },
        addTeamRegion: '.js-newTeamRegion'
    },

    ui: {
        addSeason: ".js-addSeasonBtn",
    },

    events: {
        'click @ui.addSeason': 'addSeason'
    },

    onRender: function () {
        this.collection.fetch()
            .then(function () {
                this.showChildView('listRegion', new SeasonsView({
                    collection: this.collection
                }));
                // this.showChildView('addTeamRegion', new NewTeam({
                //   collection: this.collection
                // }));
                this.triggerMethod('fetch:complete');
            }.bind(this))
            .catch(function (err) {
                //TODO: notification
                console.error(err);
            })
    },


    addSeason: function () {
        channelGlobal.trigger('modal:show', {view: 'newSeason'});
    }
});

export default SeasonsLayout;