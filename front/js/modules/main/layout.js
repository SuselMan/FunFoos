/**
 * Created by ilya on 24.02.2017.
 */

"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import User from '../../entities/user';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';

import SigninView from '../login/signin';
import SignupView from '../login/signup';
import TeamsView from '../teams/teams';
import TeamView from '../team/layout';
import PlayersView from '../players/players';
import SeasonsView from '../seasons/seasons';
import UserView from '../user/user';

let channelGlobal = Radio.channel('global');


let Layout = Marionette.View.extend({
    template: require('../../../templates/main/layout.hbs'),
    className: 'app',
    tagName: 'div',

    regions: {
        signinRegion: '.js-signinRegion',
        signupRegion: '.js-signupRegion',
        contentRegion: '.js-contentRegion',
        uploadRegion: '.js-uploadRegion'

    },

    ui: {
        nav: "a"
    },

    events: {
        'click @ui.nav': 'navigateTo'
    },

    navigateTo: function (e) {
        let url = e.currentTarget.dataset.url;
        if(url){
            let items = this.el.querySelectorAll('a');
            for(let i = 0;i< items.length;i++){
                items[i].classList.remove('active');
            }
            channelGlobal.request('navigate', url, {trigger: true, replace: true});
            e.currentTarget.classList.add('active');
        } else {
            this.showSignin();
        }

    },

    start:function(view,option){
        this.minimizeHeader();
        this.getRegion('contentRegion').empty();

        switch (view){
            case 'teams':
                this.showChildView('contentRegion', new TeamsView());
                break;
            case 'team':
                this.showChildView('contentRegion', new TeamView({id:option}));
                break;
            case 'players':
                this.showChildView('contentRegion', new PlayersView());
                break;
            case 'seasons':
                this.showChildView('contentRegion', new SeasonsView());
                break;
            case 'user':
                this.showChildView('contentRegion', new UserView({model:this.user}));
                break;
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

    doneSignin: function(user){
        this.closeSignin();
        this.minimizeHeader();
        this.user = user;
        channelGlobal.reply('get:user', this.getUser.bind(this));
        channelGlobal.request('navigate', 'user', {trigger: true, replace: true});
    },

    showSignin: function(){
        this.showChildView('signinRegion', new SigninView());
    },

    doneSignup: function(){
        this.closeSignin();
        this.el.classList.add('done');
    },

    getUser:function(){
        return this.user;
    }


});


export default Layout;