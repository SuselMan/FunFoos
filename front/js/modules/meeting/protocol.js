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
    'click @ui.game1ScoreGuest': 'showScoreSelector'
  },

  showScoreSelector(e) {
    channelGlobal.trigger('modal:show', {
      view: 'scoreSelector',
      score: 5,
      field: e.target.getAttribute('name'),
      id: this.model.id
    });
    channelGlobal.on('score:selected', (opt) => {
      this.selectScore(opt);
    });
  },

  selectScore({ field, value, id }) {
    if (id === this.model.id) {
      const obj = {};
      obj[field] = value;
      if(this.model.getWinner()){
        obj.winner = this.model.getWinner();
      }
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
      // this.el.classList.add('penalty');
    }
    this.hostSelectors = [];
    this.guestSelectors = [];
    for (let i = 0; i < type; i++) {
      this.hostSelectors.push(new dataSelector({
        selectable: this.options.user && this.options.user.get('isAdmin'),
        data: this.options.hostPlayers,
        index: i
      }));
      this.guestSelectors.push(new dataSelector({
        selectable: this.options.user && this.options.user.get('isAdmin'),
        data: this.options.guestPlayers,
        index: i
      }));
      this.showChildView(`host${i}`, this.hostSelectors[i]);
      this.showChildView(`guest${i}`, this.guestSelectors[i]);
      this.hostSelectors[i].on('change:player', this.changeHostPlayer.bind(this));
      this.guestSelectors[i].on('change:player', this.changeGuestPlayer.bind(this));
    }
    const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);
    this.setItems();
    channelGlobal.on('meeting:updated', () => {
      this.setItems();
    });
  },

  setItems() {
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
    addPenaltyBtn: '.js-addPenalty',
    admin:'.js-adminMeeting',
    hostWon:'.js-hostWon',
    guestWon:'.js-guestWon',
    draw:'.js-draw',
  },

  events: {
    'click @ui.addPenaltyBtn': 'addPenalty',
    'click @ui.hostWon': 'saveMeeting',
    'click @ui.guestWon': 'saveMeeting',
    'click @ui.draw': 'saveMeeting'
  },

  regions: {
    gamesRegion: '.js-gamesRegion',
    penaltyRegion: '.js-penaltyRegion'
  },

  initialize(options) {
    this.options = options;
  },

  saveMeeting(evt){
    const toSave = {
      score: this.collection.getScore(),
      penaltyScore: this.collection.getScore(),
      approved: true
    };
    if(evt.currentTarget === this.el.querySelector('.js-hostWon')){
      toSave.winner = this.model.get('host');
    }
    if(evt.currentTarget === this.el.querySelector('.js-guestWon')){
      toSave.winner = this.model.get('guest')
    }
    if(evt.currentTarget === this.el.querySelector('.js-draw')){
      toSave.winner = -1
    }
    this.model.save(toSave);
  },

  onRender() {
    this.user = channelGlobal.request('get:user');
    this.showAdminStuff(this.user);
    this.hostPlayers = new Players();
    this.guestPlayers = new Players();
    this.penaltyCollection = new Penalty();
    this.collection = new Games(null, { settings: this.model });
    this.collection.on('sync', this.updateResult.bind(this));

    Promise.all([
      this.collection.fetch({ data: { meeting: this.model.id } }),
      this.guestPlayers.fetch({ data: { owner: this.model.get('guest') } }),
      this.hostPlayers.fetch({ data: { owner: this.model.get('host') } })
    ]).then(() => {
      const penaltys = this.collection.where({ isPenalty: true });
      this.penaltyCollection.add(penaltys);
      this.collection.remove(penaltys);
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
  },

  addPenalty() {
    console.log('addPenalty');
    const copy = this.collection.at(0).toJSON();
    const penlaty = new this.penaltyCollection.model({
      meeting: copy.meeting,
      season: copy.season,
      division: copy.division,
      type: 1,
      isPenalty: true
    });
    penlaty.save().then(() => {
      this.penaltyCollection.add(penlaty);
    })
  },

  addPenaltyList() {
    for (let i = this.penaltyCollection.length; i < 5; i++) {
      this.addPenalty();
    }
  },

  showAdminStuff(user) {
    if (user && user.get('isAdmin')) {
      this.ui.addPenaltyBtn.show();
      this.ui.admin.show();
    } else {
      this.ui.addPenaltyBtn.hide();
      this.ui.admin.hide();
    }
  },

  updateResult() {
    this.collection.isGuestFilled();
    const score = this.collection.getScore();
    const errors = this.collection.validateGames();
    const isGamesEnd = this.collection.isEnd();
    this.el.querySelector('.js-hostScore').textContent = score[0];
    this.el.querySelector('.js-guestScore').textContent = score[1];

    if (isGamesEnd && score[0] === score[1]) {
      this.el.querySelector('.js-addPenalty').removeAttribute('disabled');
    } else {
      this.el.querySelector('.js-addPenalty').setAttribute('disabled', 'true');
    }

    if (errors.length) {
      this.el.querySelector('.js-errors').textContent = errors.join(', ');
    } else {
      this.el.querySelector('.js-errors').textContent = '';
    }
  }
});

export default ProtocolView;
