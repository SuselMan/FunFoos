/**
 * Created by pavluhin on 31.03.2017.
 */

"use strict";

import Marionette from 'backbone.marionette';
import Players from '../../entities/players';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import BaseModalView from './baseModal'
import UploadView from '../../widgets/fileUploader/fileUploader';
import ImageCropper from '../../widgets/imageCropper/imageCropper';

let channelGlobal = Radio.channel('global');

const ImageView = Marionette.View.extend({
    template: require('../../../templates/modals/image.hbs')
});

const NewTeamView = BaseModalView.extend({
    template: require('../../../templates/modals/newPlayer.hbs'),

    regions: {
        imageRegion: '.js-imageRegion'
    },

    initialize: function(options){
        this.options = options;
        this.collection = new Players();
        this.model= new this.collection.model();
        this.model.set('owner',options.team._id);
    },

    onRender:function(){
        var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);

        if(this.model.get('image')){
            this.showChildView('imageRegion', new ImageView({model:this.model}));
        } else {
            this.showUploader();
        }
    },

    submit: function () {
        this.collection.add(this.model);
        this.model.save()
            .then(function (result) {
                console.info('new player was created with owner', this.options.team.id);
                channelGlobal.trigger('player:created');
                channelGlobal.trigger('modal:close');
            }.bind(this))
            .catch(function (err) {
                console.error(err);
            })
    },

    showUploader: function(){
        this.uploadView = null;
        this.uploadView = new UploadView();
        this.showChildView('imageRegion', this.uploadView);
        this.uploadView.on('image:selected',this.showCropper.bind(this));
    },

    showCropper: function (file) {
        this.cropper = null;
        this.cropper = new ImageCropper({file:file});
        this.showChildView('imageRegion', this.cropper);
        this.cropper.on('cropper:cancel', this.showUploader.bind(this));
    },

    showImage: function(url) {
        this.model.set('image',url);
        this.showChildView('imageRegion', new ImageView({model:this.model}));
    }
});

export default NewTeamView;