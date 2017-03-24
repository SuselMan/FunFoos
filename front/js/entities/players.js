/**
 * Created by pavluhin on 01.03.2017.
 */

'use strict';

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

const Player = Backbone.Model.extend({
    idAttribute: "_id",
    initialize: function(attrs,options){
        this.options = options;
    },
    defaults: {
        firstName     : "",
        secondName  : [],
        team  : null
    }
});

const Players = Backbone.Collection.extend({
    url: '/api/players',
    model: Player,
    getPlayers: function (players) {
        var result = [];
        for (var i = 0; i < ids.length; i++) {
            let player = this.get(players[i]);
            if(player){
                result.push(player)
            }
        }
        return result;
    }
});

export default Players;