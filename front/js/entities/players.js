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
        firstName     : '',
        secondName  : '',
        owner  : null,
        image: ''
    },

    update:function(){
        return fetch('/api/players/'+this.id,{
            headers: { 'Content-Type': 'application/json' },
            method:'put',
            body:JSON.stringify(this.toJSON())
        });
    }
});

const Players = Backbone.Collection.extend({
    url: '/api/players',
    model: Player
});

export default Players;