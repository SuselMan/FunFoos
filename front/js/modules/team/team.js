/**
 * Created by pavluhin on 06.03.2017.
 */

/**
 * Created by pavluhin on 28.02.2017.
 */

"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Teams from '../../entities/teams';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Preloader from '../../behaviors/preloader';

let channelGlobal = Radio.channel('global');

const NewTeamView = Marionette.View.extend({
    template: require('../../../templates/team/newTeam.hbs'),
    ui:{
        saveBtn: ".js-addTeamBtn",
    },

    events: {
        'click @ui.saveBtn': 'save'
    },

    initialize: function(options){
        this.options = options;
        this.collection = new Teams();
        this.model= new this.collection.model();
    },

    onRender:function(){
        var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);
    },

    save: function () {
        this.collection.add(this.model);
        this.model.save()
            .then(function (result) {
                console.log('Team Added!', result);
                this.options.user.set('team',result.id);
                this.options.user.update();
            }.bind(this))
            .catch(function (e) {
                console.log('err', e);
            })
        console.log('save');

    }
});

const TeamLayout = Marionette.View.extend({
    template: require('../../../templates/team/layout.hbs'),
    regions: {
        // logoRegion: '.js-logoRegion',
        // playersRegion: '.js-logoRegion',
        // meetingsRegion: '.js-meetingsRegion',
        newTeamRegion:'.js-newTeamRegion'
    },

    initialize: function(){
    },

    onRender:function(){
        this.user = channelGlobal.request('get:user');
        if(!this.user.get('team')){
            this.showChildView('newTeamRegion', new NewTeamView({user:this.user}));

        }
    }
});


export default TeamLayout;