/**
 * Created by pavluhin on 28.02.2017.
 */

'use strict';

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

const Team = Backbone.Model.extend({
    idAttribute: "_id",
    initialize: function(attrs,options){
        this.options = options;
    },
    defaults: {
        name     : "",
        players  : [],
        meetings  : []
    }
});

const Teams = Backbone.Collection.extend({
    url: '/api/teams',
    model: Team
});

export default Teams;