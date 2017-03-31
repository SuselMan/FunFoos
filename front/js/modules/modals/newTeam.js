/**
 * Created by pavluhin on 31.03.2017.
 */

"use strict";

import Marionette from 'backbone.marionette';
import Teams from '../../entities/teams';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';

let channelGlobal = Radio.channel('global');

const NewTeamView = Marionette.View.extend({
    template: require('../../../templates/modals/newTeam.hbs'),

    ui:{
        saveBtn: ".js-createNewTeam"
    },

    events: {
        'click @ui.saveBtn': 'save'
    },

    initialize: function(options){
        this.options = options;
        this.collection = new Teams();
        this.model= new this.collection.model();
        this.model.set('owner',options.user.id);
    },

    onRender:function(){
        var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);
    },

    save: function () {
        this.collection.add(this.model);
        this.model.save()
            .then(function (result) {
                console.info('new team was created with owner', this.options.user.id);
                channelGlobal.trigger('teamCreated');
            }.bind(this))
            .catch(function (err) {
                console.error(err);
            })

    }
});

export default NewTeamView;