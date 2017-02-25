/**
 * Created by ilya on 24.02.2017.
 */

"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import SignUp from './signup'


var Layout = Marionette.View.extend({
    template: require('../../../templates/main/layout.hbs'),
    className: 'container-fluid sign-up',
    tagName: 'div',

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