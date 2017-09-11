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

    getScore: function() {
        if (this.get('hostScore0') >= 5 && this.get('hostScore1') >= 5) {
            return 0;
        }

        else if (this.get('guestScore0') >= 5 && this.get('guestScore1') >= 5) {
            return 1;
        }
        return null;
    }
});

const Games = Backbone.Collection.extend({
    url: '/api/games',
    model: Game,
    protocolStructure: [DOUBLE, DOUBLE, SINGLE, SINGLE, DOUBLE, DOUBLE] // double, double, single, single;
});

export default Games;
