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
    // select: 'js-seasonSelector'
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
    this.showChildView('playersRegion', new Players({ model: this.model, owner: this.model.id }));
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

  showLogo(url) {
    this.model.set('image', url);
    this.model.update();
    this.showChildView('logoRegion', new LogoView({ model: this.model }));
  }
});


export default TeamLayout;
