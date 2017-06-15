/**
 * Created by ipavl on 15.06.2017.
 */

'use strict';

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

const DOUBLE = 2;
const SINGLE = 1;

const Game = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/api/games',
    defaults: {
        hostPlayers: [],
        guestPlayers: [],
        score: [0, 0, 0, 0]
    },
    // We need another format data on client and server;
    remoteData: {
        winners: [],
        losers: [],
        score: [0, 0, 0, 0],
        meeting: null,
        season: null
    },

    initialize: function (attrs, options) {
        this.options = options;
    }
});

const Games = Backbone.Collection.extend({
    url: '/api/games',
    model: Game,
    protocolStructure: [DOUBLE, DOUBLE, SINGLE, SINGLE, DOUBLE, DOUBLE], // double, double, single, single;
    getEmptyCollection: function () {
        //TODO: it is wrong way when 'get' method change collection, so need to rename method or remove reset here;
        this.reset([]);
        for (var i = 0; i < this.protocolStructure.length; i++) {
            this.add(new Game({}, {type: this.protocolStructure[i]}));
        }
    }
});
1

export default Games;
