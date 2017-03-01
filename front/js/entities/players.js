/**
 * Created by pavluhin on 01.03.2017.
 */

'use strict';

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

const Player = Backbone.Model.extend({

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
    model: Player
});

export default Players;