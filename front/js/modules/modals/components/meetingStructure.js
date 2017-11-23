/**
 * Created by pavluhin on 02.10.2017.
 */


import Marionette from 'backbone.marionette';

const MeetingStructure = Marionette.View.extend({
  template: require('../../../../templates/modals/components/meetingStructure.hbs'),
  className: 'meeting-structure',
  ui: {
    doubleBtn: '.js-double',
    singleBtn: '.js-single',
    deleteBtn: '.js-delete'
  },

  events: {
    'click @ui.doubleBtn': 'addDouble',
    'click @ui.singleBtn': 'addSingle',
    'click @ui.deleteBtn': 'delete'
  },

  initialize(options) {
    this.structure = options.structure || [];
  },

  onRender() {
    for (let i = 0; i < this.structure.length; i++) {
      this.el.querySelector('.container').appendChild(this.getItem(this.structure[i]));
    }
  },

  delete() {
    this.structure = [];
    this.render();
  },

  addDouble(e) {
    e.stopPropagation();
    if (this.structure.length < 10) {
      this.structure.push(2);
    }
    this.render();
  },

  addSingle() {
    if (this.structure.length < 10) {
      this.structure.push(1);
    }
    this.render();
  },

  getItem(type) {
    const elm = document.createElement('button');
    elm.classList.add('btn');
    if (type === 1) {
      elm.classList.add('btn-warning');
      elm.textContent = 'S';
    }
    if (type === 2) {
      elm.classList.add('btn-info');
      elm.textContent = 'D';
    }
    return elm;
  },

  setStructure(structure) {
    this.structure = structure;
    this.render();
  },

  getStructure() {
    return this.structure;
  }

});

export default MeetingStructure;
