/**
 * Created by ilya on 08.03.2017.
 */

"use strict";


import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Seasons from '../../entities/Seasons';
import Radio from 'backbone.radio';
import UploadView from '../../widgets/fileUploader/fileUploader';
import Players from './players';
import Meetings from './meetings';

//TODO remove this if it will not use
//import select2 from 'select2';

let channelGlobal = Radio.channel('global');

const LogoView = Marionette.View.extend({
    template: require('../../../templates/team/logo.hbs'),
    className: 'team-logo'
});

const TeamLayout = Marionette.View.extend({
    template: require('../../../templates/team/team.hbs'),

    ui: {
        'select': 'js-seasonSelector'
    },

    regions: {
        logoRegion: '.js-logoRegion',
        playersRegion: '.js-playersRegion',
        meetingsRegion: '.js-meetingsRegion'
    },

    initialize: function (options) {
        this.options = options;
    },

    onRender: function () {
        if (this.model.get('image')) {
            this.showChildView('logoRegion', new LogoView({model: this.model}));
        } else {
            this.uploadView = new UploadView();
            this.showChildView('logoRegion', this.uploadView);
            this.uploadView.on('load:complete', this.showLogo.bind(this))
        }
        this.players = new Players();
        this.meetings = new Meetings();
        this.showChildView('playersRegion', new Players({model: this.model, owner: this.model.id}));
        this.showChildView('meetingsRegion', new Meetings({
            owner: this.model.id,
            teamsCollection: this.options.collection
        }));

        this.seasons = new Seasons();
        this.seasons.fetch({data: {state: 1}})
            .then(function (result) {
                this.createSeasonSelector();
            }.bind(this))
    },

    createSeasonSelector: function () {
        let options = this.seasons.models;
        for (var i = 0; i < options.length; i++) {
            let option = document.createElement('option');
            option.innerText = options[i].get('name');
            option.setAttribute('value', options[i].id);
            document.querySelector('#js-seasonSelector').appendChild(option);
            console.log(options[i]);
        }
        document.querySelector('#js-seasonSelector').onchange = this.selectSeason.bind(this);
    },

    selectSeason: function (e) {
        this.model.save({season: e.target.value});
    },

    showLogo: function (url) {
        this.model.set('image', url);
        this.model.update();
        this.showChildView('logoRegion', new LogoView({model: this.model}));
    }
});


export default TeamLayout;