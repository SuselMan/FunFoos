/**
 * Created by pavluhin on 09.10.2017.
 */


import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import Divisions from '../../entities/divisions';
import Preloader from '../../behaviors/preloader';
import Division from './division';

const channelGlobal = Radio.channel('global');

const ButtonView = Marionette.View.extend({
  template: require('../../../templates/subseason/addDivision.hbs'),
  tagName: 'li',
  className: 'nav-item add-button',
  events: {
    click: 'addDivision'
  },

  initialize(options) {
    this.options = options;
    this.model = new Backbone.Model.extend({});
  },

  addDivision() {
    channelGlobal.trigger('modal:show', { view: 'newDivision', subseason: this.options.subseason });
  }

});

const DivisionView = Marionette.View.extend({
  template: require('../../../templates/subseason/division.hbs'),
  className: 'nav-item',
  tagName: 'li',

  events: {
    click: 'navigate'
  },

  initialize(options) {
    this.options = options;
  },

  navigate() {
    this.trigger('division:select', this);
  },

  onRender() {
    if (this.model.get('active')) {
      this.el.children[0].classList.add('active');
    }
  }
});


const DivisionsView = Marionette.CollectionView.extend({
  childView: DivisionView,
  tagName: 'ul',
  className: 'nav nav-tabs',
  collectionEvents: {
    sync: 'render'
  },
  childViewEvents: {
    'division:select': 'selectDivision'
  },

  selectDivision(childView) {
    // TODO: refactor;
    channelGlobal.trigger('division:select', childView.model);
    this.collection.forEach((model) => {
      model.set('active', false);
    });
    childView.model.set('active', true);
    this.render();
  },

  initialize(options) {
    this.options = options;
    this.childViewOptions = options;
    if (this.collection && this.collection.length) {
      this.collection.at(0).set('active', true);
      channelGlobal.trigger('division:select', this.collection.at(0));
    }
  },

  onRender() {
    this.addChildView(new ButtonView(this.options), this.length - 1);
  }
});

const DivisionsLayout = Marionette.View.extend({
  template: require('../../../templates/subseason/divisions.hbs'),
  className: 'coll-12 divisions',
  collection: new Divisions(),
  behaviors: [Preloader],

  regions: {
    listRegion: {
      el: '.js-listRegion'
    },
    divisionDetails: '.js-division-details'
  },

  initialize(options) {
    this.options = options;
    channelGlobal.on('division:created', this.fetchDivisions.bind(this));
    channelGlobal.on('division:select', model => this.showDivision(model));
  },

  fetchDivisions() {
    return this.collection.fetch({ data: { subseason: this.model.id } });
  },

  showDivision(model) {
    this.division = new Division({ model });
    this.showChildView('divisionDetails', this.division);
  },

  onRender() {
    this.fetchDivisions()
      .then(() => {
        this.divisions = new DivisionsView({
          subseason: this.model.toJSON(),
          collection: this.collection
        });
        this.divisions.on();
        this.showChildView('listRegion', this.divisions);
        this.triggerMethod('fetch:complete');
      })
      .catch(() => {
        // TODO: throw error;
      });
  }
});

export default DivisionsLayout;
