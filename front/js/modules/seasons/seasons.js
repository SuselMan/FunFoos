/**
 * Created by pavluhin on 08.10.2017.
 */

import Marionette from 'backbone.marionette';
import ModelBinder from 'backbone.modelbinder';
import Radio from 'backbone.radio';
import Seasons from '../../entities/seasons';
import Preloader from '../../behaviors/preloader';

const channelGlobal = Radio.channel('global');


const SeasonView = Marionette.View.extend({
  template: require('../../../templates/seasons/season.hbs'),
  tagName: 'div',
  className: 'flex-card',
  ui: {
    name: '.name',
    image: '.image'
  },

  events: {
    click: 'navigateToSeason'
  },

  onRender() {
    const bindings = ModelBinder.createDefaultBindings(this.el, 'name');
    new ModelBinder().bind(this.model, this.el, bindings);
    const state = this.model.get('state');
    const stateElm = this.el.querySelector('.js-state');
    switch (state) {
      case 0:
        stateElm.textContent = 'Закрыто';
        break;
      case 1:
        stateElm.textContent = 'Регистрация';
        break;
      case 2:
        stateElm.textContent = 'В процессе';
        break;
      case 3:
        stateElm.textContent = 'Окончен';
        break;
      default:
        break;
    }
  },

  navigateToSeason() {
    channelGlobal.request('navigate', `season/${this.model.id}`, { trigger: true, replace: true });
  }
});

const EmptyView = Marionette.View.extend({
  template: require('../../../templates/seasons/empty.hbs'),
  tagName: 'li',
  className: 'list-group-item'
});

const SeasonsView = Marionette.CollectionView.extend({
  childView: SeasonView,
  emptyView: EmptyView,
  className: 'list'
});

const SeasonsLayout = Marionette.View.extend({
  template: require('../../../templates/seasons/seasons.hbs'),
  className: 'container seasons',
  collection: new Seasons(),
  behaviors: [Preloader],
  regions: {
    listRegion: {
      el: '.js-listRegion'
    },
    addTeamRegion: '.js-newTeamRegion'
  },

  ui: {
    addSeason: '.js-addSeasonBtn'
  },

  events: {
    'click @ui.addSeason': 'addSeason'
  },

  onRender() {
    this.collection.fetch()
      .then(() => {
        this.showChildView('listRegion', new SeasonsView({
          collection: this.collection
        }));
        this.triggerMethod('fetch:complete');
      })
      .catch(() => {
        // TODO: notification
      });
  },


  addSeason() {
    channelGlobal.trigger('modal:show', { view: 'newSeason' });
  }
});

export default SeasonsLayout;
