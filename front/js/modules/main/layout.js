/**
 * Created by ilya on 24.02.2017.
 */

"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import User from '../entities/user';
import ModelBinder from 'backbone.modelbinder';

import SignUp from './signup'


var Layout = Marionette.View.extend({
    template: require('../../../templates/main/layout.hbs'),
    className: 'container-fluid sign-up',
    tagName: 'div',
    model: new User(),


    ui: {
        saveBtn: ".js-save"
    },
    events: {
        'click @ui.saveBtn': 'save'
    },

    initialize: function (options) {

    },

    onRender: function() {
        console.log('this',this);
        var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);
    },

    save: function () {
        this.model.save();
        channelGlobal.trigger("saved:settings", this.model);
    }


});


export default Layout;