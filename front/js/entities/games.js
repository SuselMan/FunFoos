/**
 * Created by ipavl on 2.06.2017.
 */


import Backbone from 'backbone';

let maxScore = 5;
let maxGames = 2;

const Game = Backbone.Model.extend({
  idAttribute: '_id',
  urlRoot: '/api/games',

  initialize(attrs, options) {
    this.options = options;

  },

  validateGame() {
    const errors = [];
    if (this.get('hostScore0') === maxScore && this.get('guestScore0') === maxScore) {
      errors.push('Wrong score');
    }
    if (this.get('hostScore1') === maxScore && this.get('guestScore1') === maxScore) {
      errors.push('Wrong score');
    }
    if (this.get('hostScore0') > maxScore || this.get('guestScore0') > maxScore
      || this.get('hostScore1') > maxScore || this.get('guestScore1') > maxScore) {
      errors.push('Score cannot be more then maxScore');
    }
    if (this.get('hostPlayer0') && this.get('hostPlayer1') && this.get('hostPlayer0') === this.get('hostPlayer1')) {
      errors.push('Wrong team');
    }
    if (this.get('guestPlayer0') && this.get('guestPlayer1') && this.get('guestPlayer0') === this.get('guestPlayer1')) {
      errors.push('Wrong team');
    }
    if (errors.length) {
      this.isInvalid = true;
    }
    return errors;
  },

  isEnd() {
    if (this.get('hostScore0') >= maxScore || this.get('guestScore0') >= maxScore) {
      if (this.get('hostScore1') >= maxScore || this.get('guestScore1') >= maxScore) {
        return true;
      }
    }
    return false;
  },

  isHostFilled() {
    if (this.get('type') === 1) {
      if (this.get('hostPlayer0')) {
        return true;
      }
    } else if (this.get('hostPlayer0') && this.get('hostPlayer1')) {
      return true;
    }
    return false;
  },

  isGuestFilled() {
    if (this.get('type') === 1) {
      if (this.get('guestPlayer0')) {
        return true;
      }
    } else if (this.get('guestPlayer0') && this.get('guestPlayer1')) {
      return true;
    }
    return false;
  },

  isFullfilled() {
    return this.isHostFilled() && this.isGuestFilled();
  },

  getScore() {
    if (this.get('hostScore0') >= maxScore && this.get('hostScore1') >= maxScore) {
      return 0;
    } else if (this.get('guestScore0') >= maxScore && this.get('guestScore1') >= maxScore) {
      return 1;
    }
    return null;
  },

  combibePlayers() {
    const players = [];
    if (this.get('hostPlayer0')) {
      players.push(this.get('hostPlayer0'));
    }
    if (this.get('hostPlayer1')) {
      players.push(this.get('hostPlayer1'));
    }
    if (this.get('guestPlayer0')) {
      players.push(this.get('guestPlayer0'));
    }
    if (this.get('guestPlayer1')) {
      players.push(this.get('guestPlayer1'));
    }
    return players;
  }
});

const Games = Backbone.Collection.extend({
  url: '/api/games',
  model: Game,

  initialize(opt) {
    this.settings = opt.settings.toJSON();
    console.log('this.settings', this.settings);
    maxScore = this.settings.maxScore || 5;
    maxGames = this.settings.maxGames || 2;
  },

  getScore() {
    const score = [0, 0];
    this.each((game) => {
      if (game.getScore() != null) {
        score[game.getScore()]++;
      }
    });
    return score;
  },

  isValid() {
    return !this.validateGames().length;
  },

  isSameGames(game1, game2) {
    if (game1.isHostFilled() && game2.isHostFilled()) {
      if (game1.get('hostPlayer0') === game2.get('hostPlayer0')
        && game1.get('hostPlayer1') === game2.get('hostPlayer1')) {
        return true;
      }
      if (game1.get('hostPlayer0') === game2.get('hostPlayer1')
        && game1.get('hostPlayer1') === game2.get('hostPlayer0')) {
        return true;
      }
    }
    if (game1.isGuestFilled() && game2.isGuestFilled()) {
      if (game1.get('guestPlayer0') === game2.get('guestPlayer0')
        && game1.get('guestPlayer1') === game2.get('guestPlayer1')) {
        return true;
      }
      if (game1.get('guestPlayer0') === game2.get('guestPlayer1')
        && game1.get('guestPlayer1') === game2.get('guestPlayer0')) {
        return true;
      }
    }
    return false;
  },

  validateGames() {
    let errors = [];
    let players = [];
    const playersHash = {};
    this.each((game1) => {
      errors = errors.concat(game1.validateGame());
      players = players.concat(game1.combibePlayers());
      this.each((game2) => {
        if (game1 !== game2) {
          if (this.isSameGames(game1, game2)) {
            errors.push('Cannot are same games');
          }
        }
      });
    });
    for (let i = 0; i < players.length; i++) {
      if (!playersHash[players[i]]) {
        playersHash[players[i]] = 1;
      } else if (++playersHash[players[i]] > maxGames) {
        errors.push(`One player cannot play more then ${maxGames} games`);
      }
    }
    return errors;
  },

  isGamesComplete(){
    let isEnd = true;
    this.each((game) => {
      if(!game.isFullfilled() || !game.isEnd()){
        isEnd = false;
      }
    });
    return isEnd;
  },

  isEnd() {
    let validGames = 0;
    this.each((game) => {
      if (game.isEnd()) {
        validGames++;
      }
    });
    return validGames === this.length;
  }


});

export default Games;
