/**
 * Created by pavluhin on 24.03.2017.
 */

/**
 * Created by pavluhin on 01.03.2017.
 */

"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Players from '../../entities/players';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Preloader from '../../behaviors/preloader';

let channelGlobal = Radio.channel('global');


const PlayerView = Marionette.View.extend({
    template: require('../../../templates/players/player.hbs'),
    tagName: 'li',
    className: 'list-group-item',
    onRender: function () {
        var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);
    }
});

const EmptyView = Marionette.View.extend({
    template: require('../../../templates/players/empty.hbs'),
    tagName: 'li',
    className: 'list-group-item',
});

const PlayersView = Marionette.CollectionView.extend({
    childView: PlayerView,
    emptyView: EmptyView
});

const NewPlayer = Marionette.View.extend({
    template: require('../../../templates/players/newPlayer.hbs'),
    ui: {
        saveBtn: ".js-addPlayerBtn",
    },

    events: {
        'click @ui.saveBtn': 'save'
    },

    initialize: function (options) {
        this.options = options;
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

const PlayersLayout = Marionette.View.extend({
    template: require('../../../templates/players/players.hbs'),
    collection: new Players(),
    behaviors: [Preloader],
    regions: {
        listRegion: {
            el: '.js-listRegion'
        },
        addPlayerRegion: '.js-newPlayerRegion'
    },
    initialize: function (options) {
        this.options = options;
    },

    onRender: function () {
        this.collection.fetch({data: {team: this.options.team.id}})
            .then(function () {
                this.showChildView('listRegion', new PlayersView({
                    collection: this.collection
                }));
                this.showChildView('addPlayerRegion', new NewPlayer({
                    collection: this.collection,
                    team: this.options.team.id
                }));
                this.triggerMethod('fetch:complete');
            }.bind(this))
            .catch(function (err) {
                console.error(err);
            })
    }
});

export default PlayersLayout;