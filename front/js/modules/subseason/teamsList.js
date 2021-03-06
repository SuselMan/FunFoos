import Marionette from 'backbone.marionette';

const TeamView = Marionette.View.extend({
  template: require('../../../templates/subseason/team.hbs'),
  className: 'list-group-item team',
  tagName: 'li',

  events: {
    click: 'navigate'
  },

  initialize(options) {
    this.options = options;
  },

  onRender() {
    const image = this.model.get('image');
    if (image) {
      this.el.querySelector('.image').setAttribute('style', `background-image:url(${image})`);
    } else {
      this.el.querySelector('.image').setAttribute('style', '');
    }
  },

  navigate() {
    // TODO: navigate to team;

  }
});

const EmptyView = Marionette.View.extend({
  template: require('../../../templates/subseason/emptyTeam.hbs'),
  className: 'list-group-item team',
  tagName: 'li'
});


export default Marionette.CollectionView.extend({
  childView: TeamView,
  emptyView: EmptyView,
  tagName: 'ul',
  className: 'list-group teams-list',
  collectionEvents: {
    sync: 'render'
  },

  initialize(options) {
    this.options = options;
    this.childViewOptions = options;
  },

  onRender() {
    // this.addChildView(new ButtonView(this.options), this.length - 1);
    // TODO: maybe move add button to here?
  }
});
