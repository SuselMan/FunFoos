/**
 * Created by pavluhin on 29.03.2017.
 */

import mongoose from "mongoose";
import '../models/Player';

const Player = mongoose.model('Player');

export function changePlayer(req) {
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


export function listPlayers(req) {
  if (req.query.owner) {
    return Player.find({owner: req.query.owner})
  }
  return Player.find();
}

export function createPlayer(data, user) {
  // if (user._id === data.owner || user.isAdmin) {
  // TODO: only admin
  if (true) {
    const team = new Player({
      firstName: data.firstName,
      secondName: data.secondName,
      owner: data.owner,
      image: data.image

    });
    return team.save();
  } else {
    return new Promise(function (resolve, reject) {
      reject({
        status: 403,
        msg: 'Forbidden'
      });
    })
  }
}

export function deletePlayer(id) {
  return Player.findById(id).remove();
}

