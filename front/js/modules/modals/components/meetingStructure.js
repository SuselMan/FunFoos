/**
 * Created by pavluhin on 02.10.2017.
 */

"use strict";

import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';

let channelGlobal = Radio.channel('global');

const MeetingStructure = Marionette.View.extend({
  template: require('../../../../templates/modals/components/meetingStructure.hbs'),
  className: 'meeting-structure',
  ui:{
    doubleBtn: '.js-double',
    singleBtn:'.js-single',
    deleteBtn:'.js-delete'
  },

  events: {
    'click @ui.doubleBtn': 'addDouble',
    'click @ui.singleBtn': 'addSingle',
    'click @ui.deleteBtn': 'delete'
  },

  initialize: function(){
    this.structure = [];
  },

  onRender: function(){
    for(let i = 0; i < this.structure.length; i++){
      this.el.querySelector('.container').appendChild(this.getItem(this.structure[i]));
    }
  },

  delete: function () {
      this.structure = []
      this.render();
  },

  addDouble: function (e) {
    e.stopPropagation();
    if (this.structure.length < 10) {
      this.structure.push(2);
    }
      this.render();
  },

  addSingle:function(e){
    if (this.structure.length < 10) {
      this.structure.push(1);
    }
      this.render();
  },

  getItem: function(type){
    const elm = document.createElement('button');
    elm.classList.add('btn');
    if(type == 1){
      elm.classList.add('btn-warning');
      elm.textContent = 'S';
    }
    if(type == 2){
      elm.classList.add('btn-info');
      elm.textContent = 'D';
    }
    return elm;
  },

  getStructure: function(){
    return this.structure;
  }

});

export default MeetingStructure;