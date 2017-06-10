/**
 * Created by ipavl on 07.06.2017.
 */
'use strict';

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

const Place = Backbone.Model.extend({
    idAttribute: "_id",
    initialize: function(attrs,options){
        this.options = options;
    },
    defaults: {
        name     : '',
        workTime  : [],
        workDays  : [],
        specialDays  : null,
        image: '',
        address:'',
        link:'',
        comment:''
    },

    update:function(){
        return fetch('/api/places/'+this.id,{
            headers: { 'Content-Type': 'application/json' },
            method:'put',
            body:JSON.stringify(this.toJSON())
        });
    }
});

const Places = Backbone.Collection.extend({
    url: '/api/places',
    model: Place
});

export default Places;
