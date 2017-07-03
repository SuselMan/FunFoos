/* Created by i.pavlukhin on 07.06.2017.*/

"use strict";

import Marionette from 'backbone.marionette';
import Places from '../../entities/places';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import BaseModalView from './baseModal'
import UploadView from '../../widgets/fileUploader/fileUploader';

let channelGlobal = Radio.channel('global');

const ImageView = Marionette.View.extend({
    template: require('../../../templates/modals/image.hbs')
});

const NewPlaceView = BaseModalView.extend({
    template: require('../../../templates/modals/newPlace.hbs'),

    regions: {
        imageRegion: '.js-imageRegion'
    },

    initialize: function(options){
        this.options = options;
        this.collection = new Places();
        this.model= new this.collection.model();
    },

    onRender:function(){
        var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);

        if(this.model.get('image')){
            this.showChildView('imageRegion', new ImageView({model:this.model}));
        } else {
            this.uploadView = new UploadView();
            this.showChildView('imageRegion', this.uploadView);
            this.uploadView.on('load:complete',this.showImage.bind(this));
        }
    },

    submit: function () {
        this.collection.add(this.model);
        this.model.save()
            .then(function (result) {
                channelGlobal.trigger('place:created');
                channelGlobal.trigger('modal:close');
            }.bind(this))
            .catch(function (err) {
                console.error(err);
            })
    },

    showImage: function(url) {
        this.model.set('image',url);
        this.showChildView('imageRegion', new ImageView({model:this.model}));
    }
});

export default NewPlaceView;