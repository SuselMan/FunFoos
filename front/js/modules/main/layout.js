/**
 * Created by ilya on 24.02.2017.
 */
/**
 * Created by ilya on 24.02.2017.
 */
"use strict";

import Marionette from 'backbone.marionette';
import Backbone from 'backbone';
import SignUp from './signup'


const Layout = Marionette.LayoutView.extend({
    template: require('templates/main/layout.hbs'),

    regions: {
        content: '.js-content',
        signup: '.js-signup',
        signin: '.js-signin'
    },

    initialize: function (options) {

    },

    onRender: function () {
        //this.getRegion('signin').show(new SignUp({collection:'null'}));
    }

});

export default Layout;