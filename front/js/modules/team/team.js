/**
 * Created by ilya on 08.03.2017.
 */

"use strict";


import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import UploadView from '../../widgets/fileUploader/fileUploader';
import Players from './players';

let channelGlobal = Radio.channel('global');

const LogoView = Marionette.View.extend({
    template: require('../../../templates/team/logo.hbs')
});

const TeamLayout = Marionette.View.extend({
    template: require('../../../templates/team/team.hbs'),
    regions: {
         logoRegion: '.js-logoRegion',
         playersRegion: '.js-playersRegion'
    },
    
    showTeam:function(){

    },

    onRender:function(){
        if(this.model.get('image')){
            this.showChildView('logoRegion', new LogoView({model:this.model}));
        } else {
            this.uploadView = new UploadView();
            this.showChildView('logoRegion', this.uploadView);
            this.uploadView.on('load:complete',this.showLogo.bind(this))
        }
        this.players = new Players();
        this.showChildView('playersRegion',new Players({team: this.model}));
    },

    showLogo: function(url) {
        this.model.set('image',url);
        this.model.update();
        this.showChildView('logoRegion', new LogoView({model:this.model}));
    }
});


export default TeamLayout;