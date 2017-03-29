/**
 * Created by pavluhin on 01.03.2017.
 */

'use strict';

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

const Season = Backbone.Model.extend({

    initialize: function(attrs,options){
        this.options = options;
    },
    defaults: {
        name:"",
        meetings : [],
        teams  : [],
        isEnd  : false
    }
});

const Seasons = Backbone.Collection.extend({
    url: '/api/seasons',
    model: Season
});

export default Seasons;