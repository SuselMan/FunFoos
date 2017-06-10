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
import NewTeamView from '../modals/newTeam';
import NewPlayerView from '../modals/newPlayer';
import NewPlaceView from '../modals/newPlace';
import PlayersView from '../players/players';
import SeasonsView from '../seasons/seasons';
import UserView from '../user/user';
import MeetingsView from '../meetings/meetings';
import PlacesView from '../places/places';

let channelGlobal = Radio.channel('global');


//TODO: separate it to few files

let Layout = Marionette.View.extend({
    template: require('../../../templates/main/layout.hbs'),
    className: 'app',

    regions: {
        signinRegion: '.js-signinRegion',
        signupRegion: '.js-signupRegion',
        contentRegion: '.js-contentRegion',
        modalRegion: '.js-ModalRegion'

    },

    ui: {
        nav: "a"
    },

    events: {
        'click @ui.nav': 'navigateTo'
    },

    initialize: function () {
        this.user = new User();
    },

    navigateTo: function (e) {
        let url = e.currentTarget.dataset.url;
        if (url) {
            let items = this.el.querySelectorAll('a');
            for (let i = 0; i < items.length; i++) {
                items[i].classList.remove('active');
            }
            channelGlobal.request('navigate', url, {trigger: true, replace: true});
            e.currentTarget.classList.add('active');
        } else {
            this.showSignin();
        }

    },

    startModal(options){
        this.getRegion('modalRegion').empty();
        this.el.querySelector('.js-ModalRegion').classList.remove('hide');

        switch (options.view) {
            case 'newTeam':
                this.showChildView('modalRegion', new NewTeamView(options));
                break;
            case 'newPlayer':
                this.showChildView('modalRegion', new NewPlayerView(options));
                break;
            case 'newPlace':
                this.showChildView('modalRegion', new NewPlaceView(options));
                break;
        }
    },

    start: function (view, option) {
        this.minimizeHeader();
        this.getRegion('contentRegion').empty();
        this.el.querySelector('.sign-up').classList.toggle('team', false);

        switch (view) {
            case 'teams':
                this.showChildView('contentRegion', new TeamsView());
                break;
            case 'team':
                this.el.querySelector('.sign-up').classList.toggle('team', true);
                this.showChildView('contentRegion', new TeamView({id: option}));
                break;
            case 'players':
                this.showChildView('contentRegion', new PlayersView());
                break;
            case 'seasons':
                this.showChildView('contentRegion', new SeasonsView());
                break;
            case 'user':
                this.showChildView('contentRegion', new UserView({model: this.user}));
                break;
            case 'meetings':
                this.showChildView('contentRegion', new MeetingsView());
                break;
            case 'places':
                this.showChildView('contentRegion', new PlacesView());
                break;
        }
    },

    closeModal: function () {
        this.getRegion('modalRegion').empty();
        this.el.querySelector('.js-ModalRegion').classList.add('hide');
    },

    onRender: function () {
        this.showChildView('signupRegion', new SignupView({model: this.user}));
        channelGlobal.on("close:signin", this.closeSignin.bind(this));
        channelGlobal.on("done:signin", this.doneSignin.bind(this));
        channelGlobal.on("done:signup", this.doneSignup.bind(this));
        channelGlobal.on("modal:show", this.startModal.bind(this));
        channelGlobal.on("modal:close", this.closeModal.bind(this));
        this.signin = new SigninView({model: this.user});
        this.signin.fetch();
    },

    minimizeHeader: function () {
        this.el.querySelector('.sign-up').classList.add('done');
    },

    closeSignin: function () {
        this.getRegion('signinRegion').empty();
    },

    doneSignin: function (user) {
        this.closeSignin();
        this.minimizeHeader();
        this.user = user;
        this.el.querySelector('.js-login').innerText = user.get('email');
        channelGlobal.reply('get:user', this.getUser.bind(this));
        //channelGlobal.request('navigate', 'user', {trigger: true, replace: true});
    },

    showSignin: function () {
        this.showChildView('signinRegion', this.signin);
    },

    doneSignup: function () {
        this.closeSignin();
        this.el.classList.add('done');
    },

    getUser: function () {
        return this.user;
    }
});


export default Layout;