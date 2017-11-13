/**
 * Created by pavluhin on 03.10.2017.
 */

"use strict";


import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Seasons from '../../entities/seasons';
import moment from 'moment';
import UploadView from '../../widgets/fileUploader/fileUploader';
import SubseasonsView from './subseasons';

let channelGlobal = Radio.channel('global');

const LogoView = Marionette.View.extend({
  template: require('../../../templates/season/logo.hbs'),
  className: 'big-logo'
});

const SeasonLayout = Marionette.View.extend({
  template: require('../../../templates/season/season.hbs'),
  collection: new Seasons(),
  className: 'container big-header-layout season',

  ui: {
    dateSelector: '.js-date',
    startBtn: '.js-startBtn',
    closeBtn: '.js-closeBtn',
    openBtn: '.js-openBtn'
  },

  events: {
    'click @ui.dateSelector': 'showDateSelector',
    'click @ui.startBtn': 'startSeason',
    'click @ui.closeBtn': 'closeSeason',
    'click @ui.openBtn': 'openSeason',
  },

  regions: {
    subSeasonsRegion: '.js-subSeasonsRegion',
    logoRegion: '.js-logoRegion'
  },

  initialize: function (options) {
    this.options = options;
    this.model = new this.collection.model({ _id: this.options.id });
    this.user = channelGlobal.request('get:user');
    this.model.fetch()
      .then(
        () => {
          // TODO: refactor this terror;
          this.fetched = true;
          this.render();
        }
      );
  },
  setState(state) {
    this.model.save({ state })
      .then(() => {
        this.showStateButtons();
      });
  },
  closeSeason: function () {
    this.setState(0);
  },
  openSeason: function () {
    this.setState(1);
  },
  startSeason: function () {
    this.setState(2);
  },

  onRender: function (model) {
    if (this.fetched) {
      const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
      new ModelBinder().bind(this.model, this.el, bindings);

      let date = this.model.get('startDate');
      console.log('Model', this.model);
      console.log('date', date);
      console.log('el', this.el.querySelector('.js-date'));
      console.log('moment', moment.unix(date).format("DD MMMM YYYY, hh:mm:ss"));
      if (date) {
        this.el.querySelector('.js-date').textContent = moment.unix(date).format("DD MMMM YYYY, hh:mm:ss");
        console.log('el', this.el.querySelector('.js-date'));
      }
      this.setLogoRegion();
      this.showChildView('subSeasonsRegion', new SubseasonsView({ model: this.model }));
      this.showStateButtons();
      this.setLogoRegion();
    }
  },

  showStateButtons: function () {
    console.log('this.user', this.user);
    if (this.user && this.user.get('isAdmin')) {
      const state = this.model.get('state');
      console.log('state', state);
      this.el.querySelector('.js-openBtn').classList.remove('visible');
      this.el.querySelector('.js-startBtn').classList.remove('visible');
      this.el.querySelector('.js-closeBtn').classList.remove('visible');
      switch (state) {
        case 0:
          this.el.querySelector('.js-openBtn').classList.add('visible');
          break;
        case 1:
          this.el.querySelector('.js-startBtn').classList.add('visible');
          this.el.querySelector('.js-closeBtn').classList.add('visible');
          break;
        case 3:
          this.el.querySelector('.js-closeBtn').classList.add('visible');
          break;
      }
    }
  },

  addSubseason: function () {
    channelGlobal.trigger('modal:show', { view: 'citySelector', collection: this.places });
  },

  setLogoRegion: function () {
    if (this.uploadView) {
      this.uploadView.off('load:complete');
      channelGlobal.off('image:selected');
    }
    this.getRegion('logoRegion').empty();
    if (this.model.get('image')) {
      this.showChildView('logoRegion', new LogoView({ model: this.model }));
    } else {
      this.uploadView = new UploadView();
      this.showChildView('logoRegion', this.uploadView);
      this.uploadView.on('load:complete', this.showLogo.bind(this));
      channelGlobal.on('image:selected', this.callImageCropper.bind(this));
    }
  },

  callImageCropper: function (image) {
    channelGlobal.trigger('modal:show', { view: 'imageCropper', image: image });
    channelGlobal.on('modal:imageCropped', this.saveImage.bind(this));
  },

  saveImage: function (image) {
    this.model.save({ image: image })
      .then(() => {
        this.showChildView('logoRegion', new LogoView({ model: this.model }));
      })
  },

  showDateSelector: function () {
    console.log('showDateSelector');
    channelGlobal.trigger('modal:show', { view: 'dateSelector', collection: this.places });
  },

  showLogo: function (url) {
    this.model.set('image', url);
    this.model.update();
    this.showChildView('logoRegion', new LogoView({ model: this.model }));
  }
});


export default SeasonLayout;