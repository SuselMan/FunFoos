/**
 * Created by pavluhin on 03.10.2017.
 */


import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import moment from 'moment';
import Seasons from '../../entities/seasons';
import UploadView from '../../widgets/fileUploader/fileUploader';
import SubseasonsView from './subseasons';

const channelGlobal = Radio.channel('global');

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
    'click @ui.openBtn': 'openSeason'
  },

  regions: {
    subSeasonsRegion: '.js-subSeasonsRegion',
    logoRegion: '.js-logoRegion'
  },

  initialize(options) {
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
  closeSeason() {
    this.setState(0);
  },
  openSeason() {
    this.setState(1);
  },
  startSeason() {
    this.setState(2);
  },

  onRender() {
    if (this.fetched) {
      const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
      new ModelBinder().bind(this.model, this.el, bindings);

      const date = this.model.get('startDate');
      if (date) {
        this.el.querySelector('.js-date').textContent = moment.unix(date).format('DD MMMM YYYY, hh:mm:ss');
      }
      this.setLogoRegion();
      this.showChildView('subSeasonsRegion', new SubseasonsView({ model: this.model }));
      this.showStateButtons();
      this.setLogoRegion();
    }
  },

  showStateButtons() {
    if (this.user && this.user.get('isAdmin')) {
      const state = this.model.get('state');
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
        default:
          break;
      }
    }
  },

  addSubseason() {
    channelGlobal.trigger('modal:show', { view: 'citySelector', collection: this.places });
  },

  setLogoRegion() {
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

  callImageCropper(image) {
    channelGlobal.trigger('modal:show', { view: 'imageCropper', image });
    channelGlobal.on('modal:imageCropped', this.saveImage.bind(this));
  },

  saveImage(image) {
    this.model.save({ image })
      .then(() => {
        this.showChildView('logoRegion', new LogoView({ model: this.model }));
      });
  },

  showDateSelector() {
    channelGlobal.trigger('modal:show', { view: 'dateSelector', collection: this.places });
  },

  showLogo(url) {
    this.model.set('image', url);
    this.model.update();
    this.showChildView('logoRegion', new LogoView({ model: this.model }));
  }
});


export default SeasonLayout;
