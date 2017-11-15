/**
 * Created by pavluhin on 28.02.2017.
 */

"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Cities from '../../entities/cities';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Preloader from '../../behaviors/preloader';

let channelGlobal = Radio.channel('global');


const CityView = Marionette.View.extend({
    template: require('../../../templates/cities/city.hbs'),
    tagName: 'div',
    className: 'flex-card',
    ui: {
        name: '.name',
        image: '.image'
    },

    events: {
        'click': 'navigate',
    },

    onRender: function () {
        let bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);
    },

    navigate: function () {
        channelGlobal.request('navigate', 'city/' + this.model.id, {trigger: true, replace: true});
    }
});

const EmptyView = Marionette.View.extend({
    template: require('../../../templates/cities/empty.hbs'),
    tagName: 'li',
    className: 'list-group-item',
});

const CitiesView = Marionette.CollectionView.extend({
    childView: CityView,
    emptyView: EmptyView,
    className:'list'
});

const CitiesLayout = Marionette.View.extend({
    template: require('../../../templates/cities/cities.hbs'),
    className: 'container cities',
    collection: new Cities(),
    behaviors: [Preloader],
    regions: {
        listRegion: {
            el: '.js-listRegion'
        },
        addTeamRegion: '.js-newTeamRegion'
    },

    ui: {
        saveBtn: ".js-addCityBtn",
    },

    events: {
        'click @ui.saveBtn': 'save'
    },

    onRender: function () {
        this.collection.fetch()
            .then(function () {
                this.showChildView('listRegion', new CitiesView({
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


    save: function () {
        channelGlobal.trigger('modal:show', {view: 'newCity'});
    }
});

export default CitiesLayout;