/**
 * Created by ipavl on 14.06.2017.
 */

"use strict";

import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Games from '../../entities/games'
import Players from '../../entities/players'
import dataSelector from '../../widgets/dataSelector/dataSelector';

let channelGlobal = Radio.channel('global');

const GameView = Marionette.View.extend({
    template: require('../../../templates/meeting/game.hbs'),
    className: 'game',
    regions: {
        hostTeam: '.js-hostTeam',
        guestTeam: '.js-guestTeam'
    },

    initialize: function (options) {
        // console.log('this.model', this.model.toJSON());
        console.log('initialize');
        this.options = options;
    },

    onRender: function () {
        console.log('render');
        this.selector = new dataSelector({data: this.options.guestPlayers});
        this.showChildView('hostTeam', this.selector);
    }
});

const GamesView = Marionette.CollectionView.extend({
    className: 'games',
    childView: GameView,
    initialize: function (options) {
        this.childViewOptions = options;
    }
});

const ProtocolView = Marionette.View.extend({
    template: require('../../../templates/meeting/protocol.hbs'),
    className: 'protocol',
    regions: {
        gamesRegion: '.js-gamesRegion'
    },
    initialize: function (options) {
        this.options = options;
    },

    onRender: function () {
        console.log('RENDER2');
        this.hostPlayers = new Players();
        this.guestPlayers = new Players();
        this.collection = new Games();
        this.collection.getEmptyCollection();
        this.guestPlayers.fetch({data: {owner: this.model.get('guest')}}).then(function () {
            console.log('this here');
            this.showChildView('gamesRegion', new GamesView({
                collection: this.collection,
                guestPlayers: this.guestPlayers.toJSON()
            }));
        }.bind(this))

    }
});

export default ProtocolView;