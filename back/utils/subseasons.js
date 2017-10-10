/**
 * Created by pavluhin on 29.03.2017.
 */

import mongoose from "mongoose";
import '../models/Subseason';

const Subseason = mongoose.model('Subseason');

export function changeSubseason(req) {
  return new Promise(function (resolve, reject) {
    Subseason.findById(req.params.id, function (err, player) {
      if (player) {
        Subseason.update({_id: req.params.id}, {image: req.body.image})
          .then(function (isOk) {
            Subseason.findById(req.params.id)
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
        reject({status: 500, message: 'Subseason not found'});
      }
    });
  });

}


export function listSubseasons(req) {
  if (req.query.season) {
    return Subseason.find({season: req.query.season})
  }
  return Subseason.find();
}

export function getSubseason(req) {
    return new Promise(function(resolve, reject) {
        Subseason.findById(req.params.id,function(err,team){
            if(team){
                resolve(team);
            } else {
                reject({status:500,message:'User not found'});
            }
        });
    });
}

export function createSubseason(data, user) {
  if (user.isAdmin) {
    const subseason = new Subseason(data);
    return subseason.save();
  } else {
    return new Promise(function (resolve, reject) {
      reject({
        status: 403,
        msg: 'Forbidden'
      });
    })
  }
}

export function deleteSubseason(id) {
  return Subseason.findById(id).remove();
}

