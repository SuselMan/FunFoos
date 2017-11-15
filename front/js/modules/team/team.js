/**
 * Created by ilya on 08.03.2017.
 */


import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import Seasons from '../../entities/seasons';
import UploadView from '../../widgets/fileUploader/fileUploader';
import Players from './players';
import Meetings from './meetings';

const channelGlobal = Radio.channel('global');

const LogoView = Marionette.View.extend({
  template: require('../../../templates/team/logo.hbs'),
  className: 'team-logo'
});

const TeamLayout = Marionette.View.extend({
  template: require('../../../templates/team/team.hbs'),

  ui: {
    select: 'js-seasonSelector'
  },

  regions: {
    logoRegion: '.js-logoRegion',
    playersRegion: '.js-playersRegion',
    meetingsRegion: '.js-meetingsRegion'
  },

  initialize(options) {
    this.options = options;
    channelGlobal.off('image:selected');
  },

  onRender() {
    if (this.model.get('image')) {
      this.showChildView('logoRegion', new LogoView({ model: this.model }));
    } else {
      this.uploadView = new UploadView();
      this.showChildView('logoRegion', this.uploadView);
      this.uploadView.on('load:complete', this.showLogo.bind(this));
      channelGlobal.on('image:selected', this.callImageCropper.bind(this));
    }
    this.players = new Players();
    this.meetings = new Meetings();
    this.showChildView('playersRegion', new Players({ model: this.model, owner: this.model.id }));
    this.showChildView('meetingsRegion', new Meetings({
      owner: this.model.id,
      teamsCollection: this.options.collection
    }));

    this.seasons = new Seasons();
    this.seasons.fetch({ data: { state: 1 } })
      .then(() => {
        this.createSeasonSelector();
      });
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

  createSeasonSelector() {
    const options = this.seasons.models;
    for (let i = 0; i < options.length; i++) {
      const option = document.createElement('option');
      option.innerText = options[i].get('name');
      option.setAttribute('value', options[i].id);
      document.querySelector('#js-seasonSelector').appendChild(option);
    }
    document.querySelector('#js-seasonSelector').onchange = this.selectSeason.bind(this);
  },

  selectSeason(e) {
    this.model.save({ season: e.target.value });
  },

  showLogo(url) {
    this.model.set('image', url);
    this.model.update();
    this.showChildView('logoRegion', new LogoView({ model: this.model }));
  }
});


export default TeamLayout;
