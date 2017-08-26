/**
 * Created by ilya on 26.08.2017.
 */

"use strict";

import Marionette from 'backbone.marionette';
import Players from '../../entities/players';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import BaseModalView from './baseModal'
import ImageCropper from '../../widgets/imageCropper/imageCropper';

let channelGlobal = Radio.channel('global');

const ImageView = Marionette.View.extend({
    template: require('../../../templates/modals/image.hbs')
});

const NewTeamView = BaseModalView.extend({
    template: require('../../../templates/modals/imageCropper.hbs'),

    regions: {
        imageRegion: '.js-imageRegion'
    },

    initialize: function (options) {
        console.log('problem under line 28');
        this.options = options;
    },

    onRender: function () {
        this.showCropper(this.options.image);
    },

    submit: function () {
        this.cropper.getCroppedImage()
            .then((image)=> {
                console.log('image',image);
                channelGlobal.trigger('modal:imageCropped',image);
                channelGlobal.trigger('modal:close');
            })
    },

    showCropper: function (file) {
        this.cropper = null;
        this.cropper = new ImageCropper({file: file});
        this.showChildView('imageRegion', this.cropper);
        this.cropper.on('cropper:cancel', this.close.bind(this));
    }
});

export default NewTeamView;