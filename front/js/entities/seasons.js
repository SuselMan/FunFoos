/**
 * Created by pavluhin on 01.03.2017.
 */

'use strict';

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

const Season = Backbone.Model.extend({
    idAttribute: "_id",
    initialize: function(attrs,options){
        this.options = options;
    },
    defaults: {
        name:"",
        state  : 0
    }
});

const Seasons = Backbone.Collection.extend({
    url: '/api/seasons',
    model: Season,
    meetingStructure: [],
    name:''
});

export default Seasons;