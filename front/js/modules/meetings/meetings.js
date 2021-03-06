import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import ModelBinder from 'backbone.modelbinder';
import moment from 'moment';
import Meetings from '../../entities/meetings';
import Preloader from '../../behaviors/preloader';
import Teams from '../../entities/teams';
import Places from '../../entities/places';

const channelGlobal = Radio.channel('global');

const MeetingView = Marionette.View.extend({
  template: require('../../../templates/meetings/meeting.hbs'),
  tagName: 'li',
  className: 'list-group-item',
  ui: {
    protocol: '.protocol',
    host: '.host',
    guest: '.guest'
  },

  events: {
    'click @ui.protocol': 'navigateToMeeting',
    'click @ui.host': 'navigateToHost',
    'click @ui.guest': 'navigateToGuest'
  },

  initialize(options) {
    this.options = options;
    this.hostTeam = this.options.teams.get(this.model.get('host')).get('name');
    this.guestTeam = this.options.teams.get(this.model.get('guest')).get('name');
    this.model.set('hostTeam', this.hostTeam);
    this.model.set('guestTeam', this.guestTeam);
    const date = this.model.get('date');
    if (date) {
      this.model.set('date', moment.unix(date, 'YYYYMMDD').fromNow());
    } else {
      this.model.set('date', '—');
    }
  },

  onRender() {
    const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);

    const hostImage = this.options.teams.get(this.model.get('host')).get('image');
    if (hostImage) {
      this.el.querySelector('.hostImage').setAttribute('style', `background-image:url(${hostImage})`);
    }
    const guestImage = this.options.teams.get(this.model.get('guest')).get('image');
    if (guestImage) {
      this.el.querySelector('.guestImage').setAttribute('style', `background-image:url(${guestImage})`);
    }
  },

  navigateToMeeting() {
    channelGlobal.request('navigate', `meeting/${this.model.id}`, { trigger: true, replace: true });
  },

  navigateToHost() {
    channelGlobal.request('navigate', `team/${this.model.get('host')}`, { trigger: true, replace: true });
  },

  navigateToGuest() {
    channelGlobal.request('navigate', `team/${this.model.get('guest')}`, { trigger: true, replace: true });
  }
});

const EmptyView = Marionette.View.extend({
  template: require('../../../templates/meetings/empty.hbs'),
  tagName: 'li',
  className: 'list-group-item'
});

const MeetingsView = Marionette.CollectionView.extend({
  childView: MeetingView,
  emptyView: EmptyView,
  initialize(options) {
    this.childViewOptions = options;
  }
});


const MeetingsLayout = Marionette.View.extend({
  template: require('../../../templates/meetings/meetings.hbs'),
  className: 'container meetings',
  collection: new Meetings(),
  behaviors: [Preloader],
  regions: {
    listRegion: {
      el: '.js-listRegion'
    }
  },

  onRender() {
    this.teams = new Teams();
    this.places = new Places();
    Promise.all([
      this.teams.fetch(),
      this.places.fetch(),
      this.collection.fetch()
    ])
      .then(() => {
        this.showChildView('listRegion', new MeetingsView({
          collection: this.collection,
          teams: this.teams,
          places: this.places
        }));
        this.triggerMethod('fetch:complete');
      })
      .catch(() => {
        // TODO: throw error
      });
  }
});

export default MeetingsLayout;
