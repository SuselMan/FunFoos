/**
 * Created by ilya on 24.02.2017.
 */

"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import User from '../entities/user';
import ModelBinder from 'backbone.modelbinder';
import SigninView from '../login/signin';
import SignupView from '../login/signup';
import Radio from 'backbone.radio';

let channelGlobal = Radio.channel('global');


let Layout = Marionette.View.extend({
    template: require('../../../templates/main/layout.hbs'),
    className: 'container-fluid sign-up',
    tagName: 'div',

    regions: {
        signinRegion: '.js-signinRegion',
        signupRegion: '.js-signupRegion'
    },

    ui: {
        loginBtn: ".js-login"
    },

    events: {
        'click @ui.loginBtn': 'showSignin'
    },

    onRender: function() {
        this.showChildView('signupRegion', new SignupView());
        channelGlobal.on("close:signin", this.closeSignin.bind(this));
        channelGlobal.on("done:signin", this.doneSignin.bind(this));
        channelGlobal.on("done:signup", this.doneSignup.bind(this));
    },

    closeSignin: function(){
        this.getRegion('signinRegion').empty();
    },

    doneSignin: function(){
        this.closeSignin();
        this.el.classList.add('done');
    },

    showSignin: function(){
        this.showChildView('signinRegion', new SigninView());
    },

    doneSignup: function(){
        this.closeSignin();
        this.el.classList.add('done');
    }


});


export default Layout;