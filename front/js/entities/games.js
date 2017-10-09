/**
 * Created by ipavl on 15.06.2017.
 */

'use strict';

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

// TODO: move it out to separate ENUM file
const DOUBLE = 2;
const SINGLE = 1;

const Game = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/api/games',

    initialize: function (attrs, options) {
        this.options = options;
    },

    validateGame: function() {
        let errors = [];
        if (this.get('hostScore0') >= 5 && this.get('guestScore0') >= 5) {
            errors.push('Wrong score')
        }
        if (this.get('hostScore1') >= 5 && this.get('guestScore1') >= 5) {
            errors.push('Wrong score')
        }
        return errors
    },

    isEnd: function () {
        if(this.get('hostScore0') >= 5 || this.get('guestScore0') >= 5){
            if(this.get('hostScore1') >= 5 || this.get('guestScore1') >= 5){
                return true;
            }
        }
        return false;
    },

    getScore: function() {
        if (this.get('hostScore0') >= 5 && this.get('hostScore1') >= 5) {
            return 0;
        }

        else if (this.get('guestScore0') >= 5 && this.get('guestScore1') >= 5) {
            return 1;
        }
        return null;
    },

    combibePlayers: function(){
        let players = [];
        if(this.get('hostPlayer0')){players.push(this.get('hostPlayer0'))};
        if(this.get('hostPlayer1')){players.push(this.get('hostPlayer1'))};
        if(this.get('guestPlayer0')){players.push(this.get('guestPlayer0'))};
        if(this.get('guestPlayer1')){players.push(this.get('guestPlayer1'))};
        return players;
    }
});

const Games = Backbone.Collection.extend({
    url: '/api/games',
    model: Game,
    protocolStructure: [DOUBLE, DOUBLE, SINGLE, SINGLE, DOUBLE, DOUBLE], // double, double, single, single;

    getScore: function() {
        let score = [0, 0];
        this.each((game) => {
            if (game.getScore() != null) {
                score[game.getScore()]++
            }
        });
        return score;
    },

    isValid: function(){
        return !this.validateGames.length;
    },

    validateGames: function() {
        console.log('validate');
        let errors = [];
        let players = [];
        let playersHash = {};
        this.each((game) => {
            players = players.concat(game.combibePlayers());
        });
        console.log('players', players);
        for (let i =0; i< players.length; i++){
            if(!playersHash[players[i]]){
                playersHash[players[i]] = 1;
            } else {
                if(++playersHash[players[i]] >2){
                    errors.push('One player cannot play more then two games')
                }
            }
        }
        return errors;
    },

    isEnd: function() {
        let validGames = 0;
        this.each((game) => {
            if (game.isEnd()) {
                validGames++;
            }
        });
        return validGames === this.length;
    }


});

export default Games;
