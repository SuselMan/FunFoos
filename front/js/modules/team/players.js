/**
 * Created by pavluhin on 31.03.2017.
 */


"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Players from '../../entities/players';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Preloader from '../../behaviors/preloader';

let channelGlobal = Radio.channel('global');


const PlayerView = Marionette.View.extend({
    template: require('../../../templates/team/player.hbs'),
    tagName:'li',
    className: 'list-group-item',

    events:{
        'click': 'navigate'
    },
    navigate:function(){
        channelGlobal.request('navigate', 'player/'+this.model.id, {trigger: true, replace: true});
    },

    onRender:function () {
        var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);
    }
});

const EmptyView = Marionette.View.extend({
    template: require('../../../templates/team/empty.hbs'),
    tagName:'li',
    className: 'list-group-item',
});

const PlayersView = Marionette.CollectionView.extend({
    childView: PlayerView,
    emptyView: EmptyView
});

const PlayersLayout = Marionette.View.extend({
    template: require('../../../templates/team/players.hbs'),
    collection: new Players(),
    behaviors: [Preloader],

    ui:{
        createPlayerBtn: ".js-createPlayer"
    },

    events: {
        'click @ui.createPlayerBtn': 'createPlayer'
    },

    regions: {
        listRegion: {
            el: '.js-listRegion'
        }
    },

    initialize: function(options){
        this.options = options;
        channelGlobal.on('player:created',this.fetchPlayers.bind(this));
    },

    fetchPlayers: function(){
        return this.collection.fetch({data: {owner: this.options.owner}});
    },

    createPlayer :function() {
        channelGlobal.trigger('modal:show',{view:'newPlayer',user: this.model})
    },

    onRender: function(){
        this.fetchPlayers()
            .then(function(){
                this.showChildView('listRegion', new PlayersView({
                    collection: this.collection
                }));
                this.triggerMethod('fetch:complete');
            }.bind(this))
            .catch(function(err){
                console.error(err);
            })
    }
});

export default PlayersLayout;