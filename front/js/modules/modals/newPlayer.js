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
    template: require('../../../templates/team/newTeam.hbs'),

    ui:{
        saveBtn: ".js-addTeamBtn"
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
                this.options.user.set('team',result._id);
                this.options.user.update().then(function(result){
                    channelGlobal.trigger('user:updated',this.model);
                }.bind(this));
            }.bind(this))
            .catch(function (err) {
                console.error(err);
            })

    }
});

export default NewTeamView;