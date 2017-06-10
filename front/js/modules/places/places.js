/**
 * Created by pavluhin on 01.03.2017.
 */

"use strict";

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Places from '../../entities/places';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Preloader from '../../behaviors/preloader';

let channelGlobal = Radio.channel('global');


const PlaceView = Marionette.View.extend({
    template: require('../../../templates/places/place.hbs'),
    tagName:'li',
    className: 'list-group-item',
    onRender:function () {
        var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);
    }
});

const EmptyView = Marionette.View.extend({
    template: require('../../../templates/places/empty.hbs'),
    tagName:'li',
    className: 'list-group-item',
});

const PlacesView = Marionette.CollectionView.extend({
    childView: PlaceView,
    emptyView: EmptyView
});

const PlacesLayout = Marionette.View.extend({
    template: require('../../../templates/places/places.hbs'),
    collection: new Places(),
    behaviors: [Preloader],
    ui:{
        createPlaceBtn: ".js-createPlaceBtn"
    },
    events: {
        'click @ui.createPlaceBtn': 'createPlace'
    },
    regions: {
        listRegion: {
            el: '.js-listRegion'
        }
    },

    onRender:function(){
        this.collection.fetch()
            .then(function(){
                this.showChildView('listRegion', new PlacesView({
                    collection: this.collection
                }));
                this.triggerMethod('fetch:complete');
            }.bind(this))
            .catch(function(e){
                console.log('Something wrong',e);
            })
    },
    createPlace :function() {
        channelGlobal.trigger('modal:show',{view:'newPlace'});
    },
});

export default PlacesLayout;