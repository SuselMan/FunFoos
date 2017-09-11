/**
 * Created by pavluhin on 28.02.2017.
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
    ui: {
        name: '.name',
        image: '.image'
    },

    events: {
        'click @ui.name': 'navigateToPlayer',
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

    navigateToPlayer: function () {
        channelGlobal.request('navigate', 'player/' + this.model.id, {trigger: true, replace: true});
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

const PlayersLayout = Marionette.View.extend({
    template: require('../../../templates/players/players.hbs'),
    className: 'container players',
    collection: new Players(),
    behaviors: [Preloader],
    regions: {
        listRegion: {
            el: '.js-listRegion'
        },
        addPlayerRegion: '.js-newPlayerRegion'
    },

    onRender: function () {
        this.collection.fetch()
            .then(function () {
                this.showChildView('listRegion', new PlayersView({
                    collection: this.collection
                }));
                // this.showChildView('addPlayerRegion', new NewPlayer({
                //   collection: this.collection
                // }));
                this.triggerMethod('fetch:complete');
            }.bind(this))
            .catch(function (err) {
                //TODO: notification
                console.error(err);
            })
    }
});

export default PlayersLayout;