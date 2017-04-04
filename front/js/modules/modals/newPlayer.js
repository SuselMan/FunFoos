/**
 * Created by pavluhin on 31.03.2017.
 */

"use strict";

import Marionette from 'backbone.marionette';
import Players from '../../entities/players';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import BaseModalView from './baseModal'

let channelGlobal = Radio.channel('global');

const NewTeamView = BaseModalView.extend({
    template: require('../../../templates/modals/newTeam.hbs'),

    initialize: function(options){
        this.options = options;
        this.collection = new Players();
        this.model= new this.collection.model();
        this.model.set('owner',options.user.id);
    },

    onRender:function(){
        var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);
    },

    submit: function () {
        this.collection.add(this.model);
        this.model.save()
            .then(function (result) {
                console.info('new player was created with owner', this.options.user.id);
                channelGlobal.trigger('player:created');
                channelGlobal.trigger('modal:close');
            }.bind(this))
            .catch(function (err) {
                console.error(err);
            })
    }
});

export default NewTeamView;