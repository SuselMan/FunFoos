/**
 * Created by pavluhin on 28.02.2017.
 */

'use strict';

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

const City = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/api/cities',

    defaults: {
        name: "",
        image: "",
    },

    initialize: function (attrs, options) {
        this.options = options;
    }
});

const Cities = Backbone.Collection.extend({
    url: '/api/cities',
    model: City
});

export default Cities;