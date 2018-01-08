/**
 * Created by pavluhin on 05.01.2018
 */

import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Requests from '../../entities/requests';
import BaseModalView from './baseModal';
import Backbone from 'backbone';

const channelGlobal = Radio.channel('global');

const playerField = Marionette.View.extend({
  template: require('../../../templates/modals/components/playerField.hbs'),
  model: new Backbone.Model(),

  onRender() {
    const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);
  },

  getPlayer(structure) {
    return this.model.toJSON();
  }

});

const playersCollecion = Marionette.CollectionView.extend({
  collection: new Backbone.Collection(),
  childView: playerField,
  initialize() {
    this.addPlayer();
  },

  addPlayer() {
    this.collection.add(new Backbone.Model());
    this.render();
  }
});

const RequestTeamView = BaseModalView.extend({
  template: require('../../../templates/modals/requestTeam.hbs'),
  regions: {
    playersList: '.js-PlayersList'
  },
  ui: {
    addPlayer: '.js-addPlayer',
    closeBtn: '.js-closeBtn',
    submitBtn: '.js-submitBtn'
  },

  events: {
    'click @ui.addPlayer': 'addPlayer',
    'click @ui.closeBtn': 'close',
    'click @ui.submitBtn': 'submit'
  },

  initialize(options) {
    this.options = options;
    this.model = new Backbone.Model();
    this.players = new playersCollecion();
  },

  addPlayer() {
    this.players.addPlayer();
  },

  onRender() {
    const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);
    this.showChildView('playersList', this.players);
  },

  submit() {
    console.log('players', this.players.collection.toJSON());
    const request = new (new Requests()).model({
      type: 'addTeam',
      target: this.options.division._id,
      body: {
        name: this.model.get('name'),
        shortName: this.model.get('shortName'),
        players: this.players.collection.toJSON()
      }
    });
    console.log(request);
    request.save();
  }
});

export default RequestTeamView;
