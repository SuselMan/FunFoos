/**
 * Created by pavluhin on 10.10.2017.
 */

"use strict";


import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Subseasons from '../../entities/subseasons';
import Cities from '../../entities/cities';
import moment from 'moment';
import UploadView from '../../widgets/fileUploader/fileUploader';
import DivisionsView from './divisions';

let channelGlobal = Radio.channel('global');

const LogoView = Marionette.View.extend({
    template: require('../../../templates/subseason/logo.hbs'),
    className: 'big-logo'
});

const SubseasonLayout = Marionette.View.extend({
    template: require('../../../templates/subseason/subseason.hbs'),
    collection: new Subseasons(),
    className: 'container big-header-layout subseason',

    ui: {
        dateSelector: '.js-date'
    },

    events: {
        'click @ui.dateSelector': 'showDateSelector'
    },

    regions: {
        divisionsRegion: '.js-divisionsRegion',
        logoRegion: '.js-logoRegion'
    },

    initialize: function (options) {
        this.options = options;
        this.model = new this.collection.model({_id: this.options.id});
        this.cities = new Cities();
        Promise.all([this.model.fetch(), this.cities.fetch()])
            .then(
                () => {
                    this.setLogoRegion();
                }
            );
    },

    onRender: function (model) {
        var bindings = ModelBinder.createDefaultBindings(this.el, 'name');
        new ModelBinder().bind(this.model, this.el, bindings);
        this.showChildView('divisionsRegion', new DivisionsView({model: this.model}));
    },

    setLogoRegion: function () {
        const city = this.model.get('city');
        const image =this.cities.get(city).get('image');
        if (image) {
            this.showChildView('logoRegion', new LogoView({model: this.cities.get(city)}));
        }
    },

    saveImage: function (image) {
        this.model.save({image: image})
            .then(() => {
                this.showChildView('logoRegion', new LogoView({model: this.model}));
            })
    },

    showDateSelector: function () {
        console.log('showDateSelector');
        channelGlobal.trigger('modal:show', {view: 'dateSelector', collection: this.places});
    }
});


export default SubseasonLayout;