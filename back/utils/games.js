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

export function changeGame(req) {
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
        //TODO: if user is admin return all;
        if (user && user._id === host.owner) {
          if (meetingObj.guestApproved) {
            return Game.find({meeting: req.query.meeting});
          } else {
            return Game.find({meeting: req.query.meeting}, {guestPlayer0: 0, guestPlayer1: 0});
          }
        }
        else if (user && user._id === guest.owner) {
          if (meetingObj.guestApproved && meetingObj.hostApproved) {
            return Game.find({meeting: req.query.meeting});
          } else {
            return Game.find({meeting: req.query.meeting}, {hostPlayer0: 0, hostPlayer1: 0});
          }
        } else {
          if (meetingObj.guestApproved && meetingObj.hostApproved) {
            return Game.find({meeting: req.query.meeting});
          } else {
            return Game.find({meeting: req.query.meeting}, {
              hostPlayer0: 0,
              hostPlayer1: 0,
              guestPlayer0: 0,
              guestPlayer1: 0
            });
          }
        }
      });
  } else {
    return Game.find();
  }
}

export function createGame(data) {
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
