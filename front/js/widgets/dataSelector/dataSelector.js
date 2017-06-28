/**
 * Created by ipavl on 15.06.2017.
 */

"use strict";

import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';

let channelGlobal = Radio.channel('global');

const DataSelector = Marionette.View.extend({
    template: require('./dataSelector.hbs'),
    tagName: 'select',
    className: 'data-selector',

    initialize: function (options) {
        this.options = options;
        this.data = options.data;
        console.log('options', options);
    },

    onRender: function () {
        this.el.onchange = function (e) {
            console.log('hey', e.target.value);
            let image = '';
            for (var i = 0; i < this.data.length; i++) {
                if (this.data[i]._id + '' === e.target.value) {
                    image = this.data[i].image;
                }
            }
            if (image) {
                this.el.setAttribute('style', 'background-image:url(' + image + ')');
            } else {
                this.el.setAttribute('style', '');
            }
        }.bind(this);
        if (this.data && this.data.length) {
            for (var i = 0; i < this.data.length; i++) {
                var option = document.createElement('option');
                option.setAttribute('value', this.data[i]._id);
                option.innerText = this.data[i].firstName + " " + this.data[i].secondName;
                console.log('what', this.el);
                this.el.appendChild(option);
            }
        }
    }
});


export default DataSelector;