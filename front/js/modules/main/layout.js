/**
 * Created by ilya on 24.02.2017.
 */

"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import User from '../entities/user';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';

import SigninView from '../login/signin';
import SignupView from '../login/signup';
import TeamsView from '../teams/teams';

let channelGlobal = Radio.channel('global');


let Layout = Marionette.View.extend({
    template: require('../../../templates/main/layout.hbs'),
    className: 'app',
    tagName: 'div',

    regions: {
        signinRegion: '.js-signinRegion',
        signupRegion: '.js-signupRegion',
        contentRegion: '.js-contentRegion'
    },

    ui: {
        loginBtn: ".js-login"
    },

    events: {
        'click @ui.loginBtn': 'showSignin'
    },

    start:function(view){
        this.minimizeHeader();
        if(view == "teams"){
            console.log('this',this);
            this.showChildView('contentRegion', new TeamsView());
        }
    },

    onRender: function() {
        this.showChildView('signupRegion', new SignupView());
        channelGlobal.on("close:signin", this.closeSignin.bind(this));
        channelGlobal.on("done:signin", this.doneSignin.bind(this));
        channelGlobal.on("done:signup", this.doneSignup.bind(this));
    },

    minimizeHeader:function () {
        this.el.querySelector('.sign-up').classList.add('done');
    },

    closeSignin: function(){
        this.getRegion('signinRegion').empty();
    },

    doneSignin: function(){
        this.closeSignin();
        this.minimizeHeader();
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