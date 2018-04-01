/**
 * Created by pavluhin on 29.03.2017.
 */

import mongoose from "mongoose";
import '../models/Player';

const Player = mongoose.model('Player');

export function changePlayer(req, user) {
  if(!user.isAdmin){
    return new Promise(function (resolve, reject) {
      reject({
        status: 403,
        msg: 'Forbidden'
      });
    });
  }
  return new Promise(function (resolve, reject) {
    Player.findById(req.params.id, function (err, player) {
      if (player) {
        Player.update({_id: req.params.id}, {image: req.body.image})
          .then(function (isOk) {
            Player.findById(req.params.id)
              .then(function (player) {
                resolve(player);
              })
              .catch(function (err) {
                console.error(err);
                reject(err);
              })
          })
          .catch(function (err) {
            reject(err);
          })
      } else {
        reject({status: 500, message: 'Player not found'});
      }
    });
  });

}


export function listPlayers(req, games) {
  if (req.query.owner) {
    return Player.find({owner: req.query.owner})
  }

  return Player.find().then((players) => {
    const playersList = [];
    players.forEach((player) => {
      const paticipate = games.filter((game) => {
        return game.hostPlayer0 === player._id || game.hostPlayer1 === player._id || game.guestPlayer0 === player._id || game.guestPlayer1 === player._id;
      });
      const wins = paticipate.filter((game) => {
          console.log('game', game.winner);
          return game.winner && (game.winner[0] === player._id || game.winner[1] === player._id)
      }).length;
      const loses = paticipate.filter((game) => {
        return game.winner && game.winner[0] !== player._id && game.winner[1] !== player._id;
      }).length;
      const stats = {
        wins,
        loses,
        score: wins- loses,
        winRate: wins ? Math.floor((wins/paticipate.length) * 100) : 0
      };
      playersList.push(Object.assign({}, player.toJSON(), stats));
    });
    return playersList;
  });
}

export function createPlayer(data, user) {
  if (!user.isAdmin) {
    return new Promise(function (resolve, reject) {
      reject({
        status: 403,
        msg: 'Forbidden'
      });
    });
  }
  const team = new Player({
    firstName: data.firstName,
    secondName: data.secondName,
    owner: data.owner,
    image: data.image

  });
  return team.save();
}

export function deletePlayer(id, user) {
  if(!user.isAdmin){
    return new Promise(function (resolve, reject) {
      reject({
        status: 403,
        msg: 'Forbidden'
      });
    });
  }
  return Player.findById(id).remove();
}

