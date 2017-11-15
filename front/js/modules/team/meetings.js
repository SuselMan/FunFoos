/**
 * Created by pavluhin on 31.03.2017.
 */


import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Meetings from '../../entities/meetings';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Preloader from '../../behaviors/preloader';
import moment from 'moment';
import pikaday from 'pikaday';

moment.locale('ru');

const channelGlobal = Radio.channel('global');


const MeetingView = Marionette.View.extend({
  template: require('../../../templates/team/meeting.hbs'),
  tagName: 'div',
  className: 'flex-card',

  ui: {
    deleteBtn: '.js-deleteBtn'
  },

  events: {
    'click @ui.deleteBtn': 'deleteMeeting',
    click: 'navigate'
  },

  initialize(options) {
    this.options = options;
    let id;
    id = options.owner === this.model.get('host') ? this.model.get('guest') : this.model.get('host');
    const name = this.options.teamsCollection.get(id).get('name');
    const image = this.options.teamsCollection.get(id).get('image');
    this.model.set('name', name);
    this.model.set('image', image);
    this.model.set('time', moment(moment.unix(this.model.get('date')), 'YYYYMMDD').fromNow());
  },

  deleteMeeting(e) {
    e.stopPropagation();
    this.model.destroy();
  },

  navigate() {
    channelGlobal.request('navigate', `meeting/${this.model.id}`, { trigger: true, replace: true });
  },

  onRender() {
    const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);
    const picker = new pikaday({
      field: this.el,
      onSelect: function (date) {
        this.model.save({ date: moment(date).unix() });
      }.bind(this)
    });
  }
});

const EmptyView = Marionette.View.extend({
  template: require('../../../templates/team/emptyMeetings.hbs'),
  tagName: 'div'

  // className: 'list-group-item',
});

const MeetingsView = Marionette.CollectionView.extend({
  childView: MeetingView,
  emptyView: EmptyView,
  className: 'col-12 team-players-container',

  initialize(options) {
    this.options = options;
    this.childViewOptions = options;
  }
});

const MeetingsLayout = Marionette.View.extend({
  template: require('../../../templates/team/meetings.hbs'),
  collection: new Meetings(),
  behaviors: [Preloader],

  ui: {
    // createMeetingBtn: ".js-createMeeting"
  },

  events: {
    'click @ui.createMeetingBtn': 'createMeeting'
  },

  regions: {
    listRegion: {
      el: '.js-listRegion'
    }
  },

  initialize(options) {
    this.options = options;
  },

  fetchMeetings() {
    return this.collection.fetch({ data: { owner: this.options.owner } });
  },

  onRender() {
    this.fetchMeetings()
      .then(() => {
        this.showChildView('listRegion', new MeetingsView({
          collection: this.collection,
          teamsCollection: this.options.teamsCollection,
          owner: this.options.owner
        }));
        this.triggerMethod('fetch:complete');
      })
      .catch((err) => {
        console.error(err);
      });
  }
});

export default MeetingsLayout;
