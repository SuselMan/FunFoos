/**
 * Created by ilya on 24.02.2017.
 */


import Marionette from 'backbone.marionette';
import User from '../../entities/user';
import Radio from 'backbone.radio';
import TeamsView from '../teams/teams';
import CitiesView from '../cities/cities';
import TeamView from '../team/layout';
import CityView from '../city/city';
import SeasonView from '../season/season';
import SubseasonView from '../subseason/subseason';
import NewTeamView from '../modals/newTeam';
import NewPlayerView from '../modals/newPlayer';
import NewCityView from '../modals/newCity';
import NewSeasonView from '../modals/newSeason';
import NewDivisionView from '../modals/newDivision';
import NewPlaceView from '../modals/newPlace';
import PlayersView from '../players/players';
import SeasonsView from '../seasons/seasons';
import UserView from '../user/user';
import MeetingsView from '../meetings/meetings';
import MeetingView from '../meeting/meeting';
import PlayerSelector from '../modals/playerSelector';
import TeamSelector from '../modals/teamSelector';
import PlaceSelector from '../modals/placeSelector';
import CitySelector from '../modals/citySelector';
import SigninView from '../modals/login';
import RegistrationView from '../modals/registration';
import DateSelector from '../modals/dateSelector';
import ImageCropper from '../modals/imageCropper';

const channelGlobal = Radio.channel('global');


// TODO: separate it to few files

const Layout = Marionette.View.extend({
  template: require('../../../templates/main/layout.hbs'),
  className: 'app',

  regions: {
    contentRegion: '.js-contentRegion',
    modalRegion: '.js-ModalRegion'
  },

  ui: {
    nav: '.main > a.nav-link',
    logo: '.js-logo',
    registration: '.js-registration'
  },

  events: {
    'click @ui.nav': 'navigateTo',
    'click @ui.logo': 'navigateTo',
    'click @ui.registration': 'registration'
  },

  initialize() {
    this.user = new User();
  },

  navigateTo(e) {
    const url = e.currentTarget.dataset.url;
    if (url) {
      const items = this.el.querySelectorAll('a');
      for (let i = 0; i < items.length; i++) {
        items[i].classList.remove('active');
      }
      channelGlobal.request('navigate', url, { trigger: true, replace: true });
      e.currentTarget.classList.add('active');
    } else {
      this.showSignin();
    }
  },

  registration() {
    this.startModal({ view: 'registration', user: this.user });
  },

  startModal(options) {
    this.signin.fetch()
      .then(() => {
        this.getRegion('modalRegion').empty();
        this.el.querySelector('.js-ModalRegion').classList.remove('hide');

        switch (options.view) {
          case 'newTeam':
            this.showChildView('modalRegion', new NewTeamView(options));
            break;
          case 'newCity':
            this.showChildView('modalRegion', new NewCityView(options));
            break;
          case 'newPlayer':
            this.showChildView('modalRegion', new NewPlayerView(options));
            break;
          case 'newSeason':
            this.showChildView('modalRegion', new NewSeasonView(options));
            break;
          case 'newPlace':
            this.showChildView('modalRegion', new NewPlaceView(options));
            break;
          case 'newDivision':
            this.showChildView('modalRegion', new NewDivisionView(options));
            break;
          case 'playerSelector':
            this.showChildView('modalRegion', new PlayerSelector(options));
            break;
          case 'teamSelector':
            this.showChildView('modalRegion', new TeamSelector(options));
            break;
          case 'placeSelector':
            this.showChildView('modalRegion', new PlaceSelector(options));
            break;
          case 'citySelector':
            this.showChildView('modalRegion', new CitySelector(options));
            break;
          case 'login':
            this.showChildView('modalRegion', this.signin);
            break;
          case 'registration':
            this.showChildView('modalRegion', new RegistrationView({ model: this.user }));
            break;
          case 'dateSelector':
            this.showChildView('modalRegion', new DateSelector());
            break;

          case 'imageCropper':
            this.showChildView('modalRegion', new ImageCropper(options));
            break;
        }
      });
  },

  start(view, option) {
    this.signin.fetch()
      .then(() => {
        this.minimizeHeader();
        this.getRegion('contentRegion').empty();
        this.el.querySelector('.sign-up').classList.toggle('big-header', false);

        switch (view) {
          case 'teams':
            this.showChildView('contentRegion', new TeamsView());
            break;
          case 'team':
            this.el.querySelector('.sign-up').classList.toggle('big-header', true);
            this.showChildView('contentRegion', new TeamView({ id: option }));
            break;
          case 'city':
            this.el.querySelector('.sign-up').classList.toggle('big-header', true);
            this.showChildView('contentRegion', new CityView({ id: option }));
            break;
          case 'players':
            this.showChildView('contentRegion', new PlayersView());
            break;
          case 'seasons':
            this.showChildView('contentRegion', new SeasonsView());
            break;
          case 'cities':
            this.showChildView('contentRegion', new CitiesView());
            break;
          case 'season':
            this.el.querySelector('.sign-up').classList.toggle('big-header', true);
            this.showChildView('contentRegion', new SeasonView({ id: option }));
            break;
          case 'subseason':
            this.el.querySelector('.sign-up').classList.toggle('big-header', true);
            this.showChildView('contentRegion', new SubseasonView({ id: option }));
            break;
          case 'user':
            this.showChildView('contentRegion', new UserView({ model: this.user }));
            break;
          case 'meetings':
            this.showChildView('contentRegion', new MeetingsView());
            break;
          case 'meeting':
            this.el.querySelector('.sign-up').classList.toggle('big-header', true);
            this.showChildView('contentRegion', new MeetingView({ id: option }));
            break;
        }
      });
  },

  closeModal() {
    this.getRegion('modalRegion').reset();
    this.el.querySelector('.js-ModalRegion').classList.add('hide');
  },

  onRender() {
    channelGlobal.on('close:signin', this.closeSignin.bind(this));
    channelGlobal.on('done:signin', this.doneSignin.bind(this));
    channelGlobal.on('done:signup', this.doneSignup.bind(this));
    channelGlobal.on('modal:show', this.startModal.bind(this));
    channelGlobal.on('modal:close', this.closeModal.bind(this));

    this.signin = new SigninView({ model: this.user });
    this.signin.fetch();
    // this.el.querySelector('.app-footer').textContent = VERSION;
  },

  minimizeHeader() {
    this.el.querySelector('.sign-up').classList.add('done');
  },

  closeSignin() {
    channelGlobal.trigger('modal:close');
  },

  doneSignin(user) {
    this.closeSignin();
    this.minimizeHeader();
    this.user = user;
    this.el.querySelector('.js-login').innerText = user.get('email');
    if (user.get('isAdmin')) {
      this.el.querySelector('.js-login').innerText += ' (администратор)';
    }
    channelGlobal.reply('get:user', this.getUser.bind(this));
    // channelGlobal.request('navigate', 'user', {trigger: true, replace: true});
  },

  showSignin() {
    this.startModal({ view: 'login', user: this.user });
  },

  doneSignup() {
    this.doneSignin(this.user);
    this.el.classList.add('done');
  },

  getUser() {
    return this.user || null;
  }
});


export default Layout;
