/**
 * Created by pavluhin on 09.10.2017.
 */


"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Subseasons from '../../entities/subseasons';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Preloader from '../../behaviors/preloader';
import Cities from '../../entities/cities';

let channelGlobal = Radio.channel('global');

const ButtonView = Marionette.View.extend({
    template: require('../../../templates/season/addSubseason.hbs'),
    tagName: 'button',
    className: 'team-player flex-card',
    events: {
        'click': 'selectCity'
    },

    initialize: function (options) {
        this.options = options;
        this.model = this.options.season;
    },

    selectCity: function () {
        channelGlobal.trigger('modal:show', {view: 'citySelector', collection: this.options.cities});
    }

});

const SubseasonView = Marionette.View.extend({
    template: require('../../../templates/season/subseason.hbs'),
    tagName: 'div',
    className: 'team-player flex-card',

    ui: {
        deleteBtn: '.js-deleteBtn'
    },

    events: {
        'click': 'navigate'
    },

    initialize: function (options) {
        this.model.set('image', options.cities.get(this.model.get('city')).get('image'));
        this.model.set('name', options.cities.get(this.model.get('city')).get('name'));
    },

    navigate: function () {
        channelGlobal.request('navigate', 'subseason/' + this.model.id, {trigger: true, replace: true});
    },

    onRender: function () {
        var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);
    }
});

const SubseasonsView = Marionette.CollectionView.extend({
    childView: SubseasonView,
    className: 'col-12 team-players-container',
    collectionEvents: {
        'sync': 'render'
    },

    initialize: function (options) {
        this.options = options;
        this.childViewOptions = options;
    },

    onRender: function () {
        this.addChildView(new ButtonView({season: this.options.season, cities: this.options.cities}), 0);
    }
});

const SubseasonLayout = Marionette.View.extend({
    template: require('../../../templates/season/subseasons.hbs'),
    collection: new Subseasons(),
    behaviors: [Preloader],

    regions: {
        listRegion: {
            el: '.js-listRegion'
        }
    },

    initialize: function (options) {
        this.options = options;
        this.cities = new Cities();
        channelGlobal.on('city:selected', this.createSubseason.bind(this));
    },

    createSubseason: function (city) {
        const subseason = new this.collection.model();
        subseason.set('season', this.model.id);
        subseason.set('city', city.id);
        subseason.save()
            .then(() => {
                this.fetchSubseasons()
            });
    },

    fetchSubseasons: function () {
        return this.collection.fetch({data: {season: this.model.id}});
    },

    onRender: function () {
        Promise.all([this.fetchSubseasons(), this.cities.fetch()])
            .then(function () {
                this.showChildView('listRegion', new SubseasonsView({
                    season: this.model.toJSON(),
                    cities: this.cities,
                    collection: this.collection
                }));
                this.triggerMethod('fetch:complete');
            }.bind(this))
            .catch(function (err) {
                console.error(err);
            })
    }
});

export default SubseasonLayout;