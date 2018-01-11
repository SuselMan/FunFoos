/**
 * Created by ipavl on 14.06.2017.
 */


import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import ModelBinder from 'backbone.modelbinder';
import Games from '../../entities/games';
import Penalty from '../../entities/penalty';
import Players from '../../entities/players';
import dataSelector from '../../widgets/dataSelector/dataSelector';


const channelGlobal = Radio.channel('global');

const GameView = Marionette.View.extend({
  template: require('../../../templates/meeting/game.hbs'),
  className: 'game',

  modelEvents: {
    sync: 'setItems',
    change: 'setItems'
  },

  regions: {
    host0: '.js-firstHost',
    host1: '.js-secondHost',
    guest0: '.js-firstGuest',
    guest1: '.js-secondGuest'
  },

  ui: {
    game0ScoreHost: '.js-game0 > .host',
    game1ScoreHost: '.js-game1 > .host',
    game0ScoreGuest: '.js-game0 > .guest',
    game1ScoreGuest: '.js-game1 > .guest'
  },

  events: {
    'click @ui.game0ScoreHost': 'showScoreSelector',
    'click @ui.game1ScoreHost': 'showScoreSelector',
    'click @ui.game0ScoreGuest': 'showScoreSelector',
    'click @ui.game1ScoreGuest': 'showScoreSelector',
  },

  showScoreSelector(e){
    channelGlobal.trigger('modal:show', { view: 'scoreSelector', score: 5, field: e.target.getAttribute('name'), id: this.model.id});
    channelGlobal.on('score:selected', (opt) => {this.selectScore(opt)});
  },

  selectScore({field, value, id}) {
    if (id === this.model.id) {
      const obj = {};
      obj[field] = value;
      this.model.save(obj);
    }
  },

  initialize(options) {
    this.options = options;
  },

  onRender() {
    const type = this.model.get('type');
    const isPenalty = this.model.get('isPenalty');
    if (isPenalty) {
      this.el.classList.add('penalty');
    }
    this.hostSelectors = [];
    this.guestSelectors = [];
    console.log('options',this.options.meeting.get('guestTeam'), this.options);
    const isHostOwner = this.options.user && this.options.meeting.get('hostTeam').owner === this.options.user.id;
    const isGuestOwner = this.options.user && this.options.meeting.get('guestTeam').owner === this.options.user.id;
    for (let i = 0; i < type; i++) {
      this.hostSelectors.push(new dataSelector({
        selectable: isHostOwner && !this.options.meeting.get('hostApproved'),
        data: this.options.hostPlayers,
        index: i }));
      this.guestSelectors.push(new dataSelector({
        selectable: isGuestOwner && !this.options.meeting.get('guestApproved'),
        data: this.options.guestPlayers,
        index: i }));
      this.showChildView(`host${i}`, this.hostSelectors[i]);
      this.showChildView(`guest${i}`, this.guestSelectors[i]);
      this.hostSelectors[i].on('change:player', this.changeHostPlayer.bind(this));
      this.guestSelectors[i].on('change:player', this.changeGuestPlayer.bind(this));
    }
    const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);
    this.setItems();
    channelGlobal.on('meeting:updated', () => {this.setItems()});
  },

  setItems() {
    console.log('setItems');
    const type = this.model.get('type');
    for (let i = 0; i < type; i++) {
      const hostPlayer = this.model.get(`hostPlayer${i}`);
      if (hostPlayer && this.isHostPlayer(hostPlayer)) {
        this.hostSelectors[i].setSelected(this.options.hostPlayers.get(this.model.get(`hostPlayer${i}`)), true);
      }
      const guestPlayer = this.model.get(`guestPlayer${i}`);
      if (guestPlayer && this.isGuestPlayer(guestPlayer)) {
        this.guestSelectors[i].setSelected(this.options.guestPlayers.get(this.model.get(`guestPlayer${i}`)), true);
      }
      if(this.options.meeting.get('hostApproved')){
        this.hostSelectors[i].block();
      }
      if(this.options.meeting.get('guestApproved')){
        this.guestSelectors[i].block();
      }
    }
    // if (this.model.get('hostScore0')) this.ui.game0ScoreHost.html(this.model.get('hostScore0'));
    // if (this.model.get('hostScore1')) this.ui.game1ScoreHost.html(this.model.get('hostScore1'));
    // if (this.model.get('guestScore0')) this.ui.game0ScoreGuest.html(this.model.get('guestScore0'));
    // if (this.model.get('guestScore1')) this.ui.game1ScoreGuest.html(this.model.get('guestScore1'));
    // if (!this.collection.guestIsFilled) {
    //   this.el.querySelector('.js-firstHost').classList.add('disabled');
    //   this.el.querySelector('.js-secondHost').classList.add('disabled');
    // } else {
    //   this.el.querySelector('.js-firstHost').classList.remove('disabled');
    //   this.el.querySelector('.js-secondHost').classList.remove('disabled');
    // }
    if (this.model.get('invalid')) {
      this.el.classList.add('error');
      this.el.classList.add('error');
    } else {
      this.el.classList.remove('error');
      this.el.classList.remove('error');
    }
  },

  isHostPlayer(id) {
    return this.options.hostPlayers.get(id);
  },

  isGuestPlayer(id) {
    return this.options.guestPlayers.get(id);
  },

  changeHostPlayer(model, index) {
    const obj = {};
    obj[`hostPlayer${index}`] = model.id;
    this.model.save(obj);
  },

  changeGuestPlayer(model, index) {
    const obj = {};
    obj[`guestPlayer${index}`] = model.id;
    this.model.save(obj);
  }
});

const GamesView = Marionette.CollectionView.extend({
  className: 'games',
  childView: GameView,

  initialize(options) {
    this.childViewOptions = options;
  }
});

const ProtocolView = Marionette.View.extend({
  template: require('../../../templates/meeting/protocol.hbs'),
  className: 'protocol',

  ui: {
    approve: '.js-approve'
  },

  events: {
    'click @ui.approve': 'approveMeeting'
  },

  regions: {
    gamesRegion: '.js-gamesRegion',
    penaltyRegion: '.js-penaltyRegion'
  },

  initialize(options) {
    this.options = options;
    console.log('this.options', this.options);
  },

  onRender() {
    this.user = channelGlobal.request('get:user');
    this.checkParticipant(this.user);
    this.hostPlayers = new Players();
    this.guestPlayers = new Players();
    this.penaltyCollection = new Penalty();
    this.collection = new Games(null, { settings: this.model });
    this.collection.on('sync', this.updateResult.bind(this));
    // TODO: use websockets istead of this shit
    setInterval(() => {
      this.collection.fetch({ data: { meeting: this.model.id, isPenalty: false } });
    }, 5000);
    Promise.all([
      this.collection.fetch({ data: { meeting: this.model.id } }),
      this.guestPlayers.fetch({ data: { owner: this.model.get('guest') } }),
      this.hostPlayers.fetch({ data: { owner: this.model.get('host') } })
    ]).then(() => {
      const penaltys = this.collection.where({ isPenalty: true });
      this.penaltyCollection.add(penaltys);
      this.collection.remove(penaltys);
      // this.addPenaltyList();
      this.showChildView('gamesRegion', new GamesView({
        collection: this.collection,
        guestPlayers: this.guestPlayers,
        hostPlayers: this.hostPlayers,
        user: this.user,
        meeting: this.model
      }));
      this.showChildView('penaltyRegion', new GamesView({
        collection: this.penaltyCollection,
        guestPlayers: this.guestPlayers,
        hostPlayers: this.hostPlayers,
        user: this.user,
        meeting: this.model
      }));
    });
    // this.model.save({hostApproved: 0});
    // this.model.save({guestApproved: 0});
  },

  addPenalty() {
    const copy = this.collection.at(0).toJSON();
    const penlaty = new this.penaltyCollection.model({
      meeting: copy.meeting,
      season: copy.season,
      division: copy.division,
      type: 1,
      isPenalty: true
    });
    this.penaltyCollection.add(penlaty);
  },

  addPenaltyList() {
    for (let i = this.penaltyCollection.length; i < 5; i++) {
      this.addPenalty();
    }
  },

  checkParticipant(user) {
    //TODO: must return booolean remove logi from here
    if (user && (this.model.get('guestTeam').owner === user.id || this.model.get('hostTeam').owner === user.id || user.get('isAdmin'))) {
      this.ui.approve.show();
    } else {
      this.ui.approve.hide();
    }
  },

  approveMeeting() {
    let savePromise;
    if(this.user && this.model.get('guestTeam').owner === this.user.id && !this.model.get('guestApproved')) {
      savePromise = this.model.save({guestApproved: 1});
    } else if(this.user && this.model.get('guestTeam').owner === this.user.id && this.model.get('guestApproved')) {
      savePromise = this.model.save({guestApproved: 2});
    } else if(this.user && this.model.get('hostTeam').owner === this.user.id && !this.model.get('hostApproved')) {
      savePromise = this.model.save({hostApproved: 1});
    } else if(this.user && this.model.get('hostTeam').owner === this.user.id && this.model.get('hostApproved') ) {
      savePromise = this.model.save({hostApproved: 2});
    }
    savePromise.then(() => {
      channelGlobal.trigger('meeting:updated');
      this.updateResult();
    })
  },

  updateResult() {
    this.collection.isGuestFilled();
    const score = this.collection.getScore();
    const errors = this.collection.validateGames();
    const isGamesEnd = this.collection.isEnd();
    this.el.querySelector('.js-hostScore').textContent = score[0];
    this.el.querySelector('.js-guestScore').textContent = score[1];
    if(this.user && this.model.get('guestTeam').owner === this.user.id){
      if(!this.model.get('guestApproved') && this.collection.isGuestFilled()) {
        this.el.querySelector('.js-approve').disabled = false;
        this.el.querySelector('.js-approve').textContent = 'Подтвердить состав'
      } else {
        this.el.querySelector('.js-approve').disabled = !(isGamesEnd && !errors.length);
        this.el.querySelector('.js-approve').textContent = 'Подтвердить встречу'
      }
    }
    if(this.user && this.model.get('hostTeam').owner === this.user.id){
      if(!this.model.get('hostApproved') && this.collection.isHostFilled()) {
        this.el.querySelector('.js-approve').disabled = false;
        this.el.querySelector('.js-approve').textContent = 'Подтвердить состав'
      } else {
        this.el.querySelector('.js-approve').disabled = !(isGamesEnd && !errors.length);
        this.el.querySelector('.js-approve').textContent = 'Подтвердить встречу'
      }
    }
    if (isGamesEnd && this.penaltyCollection.length < 5) {
      this.addPenaltyList();
    }
    console.log('this.collection.isGuestFilled()', this.collection.isGuestFilled());
    if (errors.length) {
      this.el.querySelector('.js-errors').textContent = errors.join(', ');
    } else {
      this.el.querySelector('.js-errors').textContent = '';
    }
  }
});

export default ProtocolView;
