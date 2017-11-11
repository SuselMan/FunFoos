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
import Division from './division';

let channelGlobal = Radio.channel('global');

const ButtonView = Marionette.View.extend({
    template: require('../../../templates/subseason/addDivision.hbs'),
    tagName: 'li',
    className: 'nav-item add-button',
    events: {
        'click': 'addDivision'
    },

    initialize: function (options) {
        this.options = options;
    },

    addDivision: function () {
        channelGlobal.trigger('modal:show', {view: 'newDivision', subseason: this.options.subseason});
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
        this.trigger('division:select', this);
    }
});


const DivisionsView = Marionette.CollectionView.extend({
    childView: DivisionView,
    tagName: 'ul',
    className: 'nav nav-tabs',
    collectionEvents: {
        'sync': 'render'
    },
    childViewEvents: {
        'division:select': 'selectDivision'
    },

    selectDivision: function (childView) {
        // TODO: refactor;
        channelGlobal.trigger('division:select', childView.model);
        this.children.each((view) => {
            view.el.children[0].classList.remove('active');
        });
        childView.el.children[0].classList.add('active');
    },

    initialize: function (options) {
        this.options = options;
        this.childViewOptions = options;
    },

    onRender: function () {
        this.addChildView(new ButtonView(this.options), this.length - 1);
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
        },
        divisionDetails: '.js-division-details'
    },

    initialize: function (options) {
        this.options = options;
        channelGlobal.on('division:created', this.fetchDivisions.bind(this));
        channelGlobal.on('division:select', model => this.showDivision(model));
    },

    fetchDivisions: function () {
        return this.collection.fetch({data: {subseason: this.model.id}});
    },

    showDivision: function (model) {
        this.division = new Division({model});
        this.showChildView('divisionDetails', this.division);
    },

    onRender: function () {
        this.fetchDivisions()
            .then(() => {
                this.divisions = new DivisionsView({
                    subseason: this.model.toJSON(),
                    collection: this.collection
                });
                this.divisions.on()
                this.showChildView('listRegion', this.divisions);
                this.triggerMethod('fetch:complete');
            })
            .catch(function (err) {
                console.error(err);
            })
    }
});

export default DivisionsLayout;