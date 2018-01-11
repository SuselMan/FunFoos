/**
 * Created by pavluhin on 05.07.2017.
 */

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import BaseModalView from './baseModal';

const channelGlobal = Radio.channel('global');
let field = '';
let id = -1;
const ScoreView = Marionette.View.extend({
  template: require('../../../templates/modals/components/scoreCard.hbs'),
  tagName: 'div',
  className: 'flex-card score-card',
  events: {
    click: 'navigate'
  },

  navigate() {
    channelGlobal.trigger('score:selected', {value:this.model.get('value'), field, id});
    channelGlobal.trigger('modal:close');
  }
});

const ScoresView = Marionette.CollectionView.extend({
  childView: ScoreView,
  className: 'col-12 team-players-container',

  initialize(options) {
    this.options = options;
  },

  onRender() {

  }
});

const ScoresModal = BaseModalView.extend({
  template: require('../../../templates/modals/selectScore.hbs'),

  regions: {
    scoresRegion: '.js-scoresRegion'
  },

  initialize(options) {
    this.options = options;
    this.highScore = options.score || 5;
    this.collection = new Backbone.Collection();
    field = options.field || '';
    id = options.id || '';
    for(let i = 0; i <= this.highScore; i++){
      this.collection.add(new Backbone.Model({value: i}))
    }
  },

  onRender() {
    this.showChildView('scoresRegion', new ScoresView({
      collection: this.collection
    }));
  }
});

export default ScoresModal;
