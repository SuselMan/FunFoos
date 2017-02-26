/**
 * Created by ilya on 24.02.2017.
 */

"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import User from '../entities/user';
import ModelBinder from 'backbone.modelbinder';
import LoginView from './login';
import Radio from 'backbone.radio';

let channelGlobal = Radio.channel('global');


let Layout = Marionette.View.extend({
    template: require('../../../templates/main/layout.hbs'),
    className: 'container-fluid sign-up',
    tagName: 'div',
    model: new User(),

    regions: {
        loginRegion: '.js-login-region'
    },

    ui: {
        saveBtn: ".js-save",
        loginBtn: ".js-login"
    },

    events: {
        'click @ui.saveBtn': 'save',
        'click @ui.loginBtn': 'login'
    },

    initialize: function (options) {

    },

    onRender: function() {
        console.log('this',this);
        var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);
        channelGlobal.on("close:login", this.closeLogin.bind(this));
    },

    closeLogin: function(){
        this.getRegion('loginRegion').empty();
    },

    login: function(){
        this.showChildView('loginRegion', new LoginView());
    },

    save: function () {
        this.model.save()
    }


});


export default Layout;