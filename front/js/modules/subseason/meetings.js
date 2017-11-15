/**
 * Created by pavluhin on 15.11.2017.
 */


import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import Teams from '../../entities/teams';
import Meetings from '../../entities/meetings';

const channelGlobal = Radio.channel('global');

const MeetingsTableItem = Backbone.Model.extend({
  defaults: {
    meetings: null
  }
});

const MeetingsTableCollection = Backbone.Collection.extend({
  model: MeetingsTableItem
});

const MeetingItem = Marionette.View.extend({
  template: require('../../../templates/subseason/meetings/meetingItem.hbs'),
  className: 'meeting-item',
  events: {
    click: 'navigate'
  },
  navigate() {
    channelGlobal.request('navigate', `meeting/${this.model.id}`, { trigger: true, replace: true });
  }
});

const MeetingsItemList = Marionette.CollectionView.extend({
  childView: MeetingItem,
  className: 'meetings-item-list',
  initialize() {
    console.log('coll', this.collection);
    this.render();
  }
});

const TableItem = Marionette.View.extend({
  // template: require('../../../templates/subseason/meetings/tableItem.hbs'),
  className: 'tableItem',
  regions: {
    meetingsItemRegion: '.js-itemMeetingsRegion'
  },
  getTemplate() {
    if (this.mode === 'team') {
      return require('../../../templates/subseason/meetings/teamItem.hbs');
    } else if (this.mode === 'empty') {
      return require('../../../templates/subseason/meetings/emptyItem.hbs');
    }
    return require('../../../templates/subseason/meetings/tableItem.hbs');
  },

  initialize() {
    this.basis = this.model.get('basis');
    if (this.model.get('team')) {
      this.model = this.model.get('team');
      this.mode = 'team';
    } else if (this.model.get('meetings')) {
      this.mode = 'meeting';
    } else {
      this.mode = 'empty';
    }
  },

  onRender() {
    this.el.setAttribute('style', `flex-basis:${this.basis}%`);
    if (this.mode === 'team') {
      this.el.classList.add('teamItem');
    }
    if (this.mode === 'empty') {
      this.el.classList.add('emptyItem');
    }
    if (this.mode === 'meeting') {
      this.el.classList.add('meetingItem');
      this.showChildView('meetingsItemRegion', new MeetingsItemList({ collection: this.model.get('meetings') }));
    }
  }
});

const MeetingsTable = Marionette.CollectionView.extend({
  childView: TableItem,
  className: 'meetings-table',
  initialize() {
    console.log('initialize MeetingsTable');
    this.render();
  }
});

export default Marionette.View.extend({
  template: require('../../../templates/subseason/meetings/meetings.hbs'),
  tagName: 'div',
  className: 'test',
  regions: {
    meetingsTableRegion: '.js-meetingsTableRegion'
  },

  initialize(options) {
    this.options = options;
    this.teams = options.teams;
    this.meetings = options.meetings;
    this.generateMeetingsCollection();
    this.render();
  },

  onRender() {
    console.log('HEY BRO', this.meetingsColl);
    this.showChildView('meetingsTableRegion', new MeetingsTable({ collection: this.meetingsColl }));
  },

  generateMeetingsCollection() {
    this.meetingsColl = new MeetingsTableCollection();
    const basis = Math.floor(100 / (this.teams.length + 1));
    this.meetingsColl.add(new MeetingsTableItem({ basis }));
    this.teams.forEach((team) => {
      this.meetingsColl.add(new MeetingsTableItem({ basis, team }));
    });
    this.teams.forEach((team1) => {
      this.meetingsColl.add(new MeetingsTableItem({ basis, team: team1 }));
      this.teams.forEach((team2) => {
        const item = new MeetingsTableItem();
        const meetings = this.meetings.where({ host: team1.id, guest: team2.id });
        if (team1 !== team2 && meetings.length) {
          const collection = new Meetings(meetings);
          this.meetingsColl.add(new MeetingsTableItem({ meetings: collection, basis }));
        } else {
          this.meetingsColl.add(new MeetingsTableItem({ basis }));
        }
      });
    });
  }
});
