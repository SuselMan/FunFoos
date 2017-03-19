/**
 * Created by pavluhin on 28.02.2017.
 */

'use strict';

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

const Team = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/api/teams',

    defaults: {
        name     : "",
        players  : [],
        meetings  : [],
        image: ""
    },

    initialize: function(attrs,options){
        this.options = options;
    },

    update:function(){
        return fetch('/api/teams/'+this.id,{
            headers: { 'Content-Type': 'application/json' },
            method:'put',
            body:JSON.stringify(this.toJSON())
        });
    },
});

const Teams = Backbone.Collection.extend({
    url: '/api/teams',
    model: Team
});

export default Teams;