/**
 * Created by pavluhin on 24.04.2017.
 */

import mongoose from "mongoose";
import '../models/Game';

const Game = mongoose.model('Game');


//TODO: Refactor

export function getGame(req) {
  return new Promise(function (resolve, reject) {
    Game.findById(req.params.id, function (err, game) {
      if (game) {
        resolve(game);
      } else {
        reject({status: 500, message: 'Game not found'});
      }
    });
  });
}

export function changeGame(req, user) {
  if(!user.isAdmin){
    return new Promise(function (resolve, reject) {
      reject({
        status: 403,
        msg: 'Forbidden'
      });
    });
  }
  return new Promise(function (resolve, reject) {
    Game.findById(req.params.id, function (err, game) {
      if (game) {
        Game.update({_id: req.params.id}, req.body)
          .then(function (isOk) {
            Game.findById(req.params.id)
              .then(function (game) {
                resolve(game);
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
        reject({status: 500, message: 'Game not found'});
      }
    });
  });
}

export function listGames(req, user) {
  //TODO: use all params if it will need;
  let meetingObj;
  if (req.query.meeting) {
    return this.getMeeting({params: {id: req.query.meeting}})
      .then((meeting) => {
        meetingObj = meeting;
        return Promise.all([this.getTeam({params: {id: meeting.host}}), this.getTeam({params: {id: meeting.guest}})])
      })
      .then(([host, guest]) => {
        return Game.find({meeting: req.query.meeting});
      });
  } else {
    return Game.find();
  }
}

export function createGame(data, user = {}) {
  if(!user.isAdmin){
    return new Promise(function (resolve, reject) {
      reject({
        status: 403,
        msg: 'Forbidden'
      });
    });
  }
  const game = new Game({
    meeting: data.meeting,
    season: data.season,
    division: data.division,
    type: data.type,
    isPenalty: data.isPenalty || false,
    approved: false
  });
  return game.save();
}

export function createGames(dataArr) {
  return new Promise((resolve, reject) => {
    Game.create(dataArr, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res)
      }
    });
  })
}

export function deleteGame(id) {
  return Game.findById(id).remove();
}
