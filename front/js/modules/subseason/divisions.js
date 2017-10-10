/**
 * Created by pavluhin on 09.10.2017.
 */


"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Divisions from '../../entities/divisions';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Preloader from '../../behaviors/preloader';

let channelGlobal = Radio.channel('global');

const ButtonView = Marionette.View.extend({
    template: require('../../../templates/subseason/addDivision.hbs'),
    tagName: 'li',
    className:'nav-item add-button',
    events: {
        'click': 'addDivision'
    },

    initialize: function (options) {
        this.options = options;
        this.model = this.options.subseason;
    },

    addDivision: function () {
        channelGlobal.trigger('modal:show', {view: 'newDivision', collection: this.model});
    }

});

const DivisionView = Marionette.View.extend({
    template: require('../../../templates/subseason/division.hbs'),
    className: 'nav-item',
    tagName: 'li',

    events: {
        'click': 'navigate'
    },

    initialize: function (options) {
        this.options = options;
    },

    navigate: function () {
        this.trigger('division:select', this.model);
    }
});


const DivisionsView = Marionette.CollectionView.extend({
    childView: DivisionView,
    tagName: 'ul',
    className: 'nav nav-tabs',
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

const DivisionsLayout = Marionette.View.extend({
    template: require('../../../templates/subseason/divisions.hbs'),
    className: 'coll-12 divisions',
    collection: new Divisions(),
    behaviors: [Preloader],

    regions: {
        listRegion: {
            el: '.js-listRegion'
        }
    },

    initialize: function (options) {
        this.options = options;
        channelGlobal.on('division:created', this.fetchDivisions.bind(this));
    },

    fetchDivisions: function () {
        return this.collection.fetch({data: {season: this.model.id}});
    },

    onRender: function () {
        this.fetchDivisions()
            .then(function () {
                this.showChildView('listRegion', new DivisionsView({
                    subseason: this.model.toJSON(),
                    collection: this.collection
                }));
                this.triggerMethod('fetch:complete');
            }.bind(this))
            .catch(function (err) {
                console.error(err);
            })
    }
});

export default DivisionsLayout;