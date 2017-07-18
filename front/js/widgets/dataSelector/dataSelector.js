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
  tagName: 'div',
  className: 'data-selector',
  events: {
    'click': 'navigate'
  },

  initialize: function (options) {
    this.options = options;
    this.data = options.data;
    this.current = null;
  },

  onRender: function () {
    // this.el.onchange = function (e) {
    //     let image = '';
    //     for (var i = 0; i < this.data.length; i++) {
    //         if (this.data[i]._id + '' === e.target.value) {
    //             image = this.data[i].image;
    //         }
    //     }
    //     if (image) {
    //         this.el.setAttribute('style', 'background-image:url(' + image + ')');
    //     } else {
    //         this.el.setAttribute('style', '');
    //     }
    // }.bind(this);
    // if (this.data && this.data.length) {
    //     for (var i = 0; i < this.data.length; i++) {
    //         var option = document.createElement('option');
    //         option.setAttribute('value', this.data[i]._id);
    //         option.innerText = this.data[i].firstName + " " + this.data[i].secondName;
    //         this.el.appendChild(option);
    //     }
    // }
  },

  setSelected: function(model){
    this.current = model;
    channelGlobal.off('player:selected');
    console.log('select',model);
    this.el.querySelector('span').innerHTML = model.get('firstName') + ' ' + model.get('secondName');
    let image = model.get('image');
    if (image) {
        this.el.setAttribute('style', 'background-image:url(' + image + ')');
    } else {
        this.el.setAttribute('style', '');
    }
    this.trigger('change:player', this.current, this.options.index);
  },

  navigate: function(){
    channelGlobal.on('player:selected',this.setSelected.bind(this));
    channelGlobal.on("modal:close", ()=>{
      channelGlobal.off('player:selected');
    });
    channelGlobal.trigger('modal:show',{view:'playerSelector', collection: this.data});
  }
});


export default DataSelector;