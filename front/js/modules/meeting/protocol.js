/**
 * Created by ipavl on 14.06.2017.
 */


import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
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
    game0ScoreHost: '.js-game0 > input.host',
    game1ScoreHost: '.js-game1 > input.host',
    game0ScoreGuest: '.js-game0 > input.guest',
    game1ScoreGuest: '.js-game1 > input.guest'
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
    for (let i = 0; i < type; i++) {
      this.hostSelectors.push(new dataSelector({ data: this.options.hostPlayers, index: i }));
      this.guestSelectors.push(new dataSelector({ data: this.options.guestPlayers, index: i }));
      this.showChildView(`host${i}`, this.hostSelectors[i]);
      this.showChildView(`guest${i}`, this.guestSelectors[i]);
      this.hostSelectors[i].on('change:player', this.changeHostPlayer.bind(this));
      this.guestSelectors[i].on('change:player', this.changeGuestPlayer.bind(this));
    }
    const scores = this.el.querySelectorAll('input');
    for (let i = 0; i < scores.length; i++) {
      scores[i].onchange = this.changeScore.bind(this);
    }
    this.setItems();
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
    }
    if (this.model.get('hostScore0')) this.ui.game0ScoreHost.val(this.model.get('hostScore0'));
    if (this.model.get('hostScore1')) this.ui.game1ScoreHost.val(this.model.get('hostScore1'));
    if (this.model.get('guestScore0')) this.ui.game0ScoreGuest.val(this.model.get('guestScore0'));
    if (this.model.get('guestScore1')) this.ui.game1ScoreGuest.val(this.model.get('guestScore1'));
    if(!this.collection.guestIsFilled){
      this.el.querySelector('.js-firstHost').classList.add('disabled');
      this.el.querySelector('.js-secondHost').classList.add('disabled');
    } else {
      this.el.querySelector('.js-firstHost').classList.remove('disabled');
      this.el.querySelector('.js-secondHost').classList.remove('disabled');
    }
    if(this.model.get('invalid')){
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
  },

  changeScore(e) {
    const obj = {};
    obj[e.target.dataset.name] = e.target.value;
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
    setInterval(function () {
        this.collection.fetch({data: {meeting: this.model.id, isPenalty:false}})
    }.bind(this), 5000);
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
        hostPlayers: this.hostPlayers
      }));
      this.showChildView('penaltyRegion', new GamesView({
        collection: this.penaltyCollection,
        guestPlayers: this.guestPlayers,
        hostPlayers: this.hostPlayers
      }));
    })
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

  addPenaltyList(){
    for (let i = this.penaltyCollection.length; i < 5; i++) {
      this.addPenalty();
    }
  },

  checkParticipant(user) {
    if (user && (this.model.get('guest') === user.id || this.model.get('guest') === user.id || user.get('isAdmin'))) {
      this.ui.approve.show();
    } else {
      this.ui.approve.hide();
    }
  },

  approveMeeting() {

  },

  updateResult() {
    this.collection.isGuestFilled();
    const score = this.collection.getScore();
    const errors = this.collection.validateGames();
    const isGamesEnd = this.collection.isEnd();
    this.el.querySelector('.js-hostScore').textContent = score[0];
    this.el.querySelector('.js-guestScore').textContent = score[1];
    this.el.querySelector('.js-approve').disabled = !(isGamesEnd && !errors.length);
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
