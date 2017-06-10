/**
 * Created by pavluhin on 01.03.2017.
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
    tagName: 'li',
    className: 'list-group-item',
    ui: {
        openSeasonBtn: '.js-openSeasonBtn',
        startSeasonBtn: '.js-startSeasonBtn',
    },

    events: {
        'click @ui.startSeasonBtn': 'startSeason',
        'click @ui.openSeasonBtn': 'openSeason'
    },

    onRender: function () {
        var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);
    },

    openSeason: function () {
        this.model.save({state:1});
    },

    startSeason: function () {
        this.model.save({state:2});
    }

});

const EmptyView = Marionette.View.extend({
    template: require('../../../templates/seasons/empty.hbs'),
    tagName: 'li',
    className: 'list-group-item',
});

const SeasonsView = Marionette.CollectionView.extend({
    childView: SeasonView,
    emptyView: EmptyView
});

const NewSeason = Marionette.View.extend({
    template: require('../../../templates/seasons/newSeason.hbs'),
    ui: {
        saveBtn: ".js-addSeasonBtn",
    },

    events: {
        'click @ui.saveBtn': 'save'
    },

    initialize: function () {
        this.model = new this.collection.model();
    },

    onRender: function () {
        var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);
    },

    save: function () {
        this.collection.add(this.model);
        this.model.save()
            .then(function (result) {

            })
            .catch(function (err) {
                console.error(err);
            })

    },
});

const SeasonsLayout = Marionette.View.extend({
    template: require('../../../templates/seasons/seasons.hbs'),
    collection: new Seasons(),
    behaviors: [Preloader],
    regions: {
        listRegion: {
            el: '.js-listRegion'
        },
        addSeasonRegion: '.js-newSeasonRegion'
    },

    onRender: function () {
        this.collection.fetch()
            .then(function () {
                this.showChildView('listRegion', new SeasonsView({
                    collection: this.collection
                }));
                this.showChildView('addSeasonRegion', new NewSeason({
                    collection: this.collection
                }));
                this.triggerMethod('fetch:complete');
            }.bind(this))
            .catch(function (e) {
                console.error(e);
            })
    }
});

export default SeasonsLayout;