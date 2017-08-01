/**
 * Created by pavluhin on 24.04.2017.
 */

import mongoose from "mongoose";
import '../models/Game';

const Game = mongoose.model('Game');


//TODO: Refactor

export function getGame(req) {
  return new Promise(function(resolve, reject) {
    Game.findById(req.params.id,function(err,game){
      if(game){
        resolve(game);
      } else {
        reject({status:500,message:'Game not found'});
      }
    });
  });
}

export function changeGame(req) {
  return new Promise(function(resolve, reject) {
    Game.findById(req.params.id,function(err,game){
      if(game){
        Game.update({_id:req.params.id},req.body)
          .then(function (isOk) {
            Game.findById(req.params.id)
              .then(function(game){
                resolve(game);
              })
              .catch(function(err){
                console.error(err);
                reject(err);
              })
          })
          .catch(function (err) {
            reject(err);
          })
      } else {
        reject({status:500,message:'Game not found'});
      }
    });
  });
}

export function listGames(req) {
  //TODO: use all params if it will need;
  if(req.query.meeting){
    return Game.find({ meeting:  req.query.meeting })
  }
  return Game.find();
}

export function createGame(data) {
  const game = new Game({
    meeting  : data.meeting,
    season  : data.season,
    type: data.type,
    approved:false
  });
  return game.save();
}

export function deleteGame(id) {
  return Game.findById(id).remove();
}
