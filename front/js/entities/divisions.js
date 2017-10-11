/**
 * Created by pavluhin on 01.03.2017.
 */

'use strict';

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

const Division = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: '/api/divisions',
    initialize: function(attrs,options){
        this.options = options;
    },
    defaults: {
        rounds: 2,
        meetingStructure: [2,2,1,1,2,2],
        subseason:null,
        penalty: false,
        season:null
    }
});

export default Backbone.Collection.extend({
    url: '/api/divisions',
    model: Division,
    name:''
});
