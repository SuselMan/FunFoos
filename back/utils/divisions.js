/**
 * Created by pavluhin on 29.03.2017.
 */

import mongoose from "mongoose";
import '../models/Division';

const Division = mongoose.model('Division');

export function changeDivision(req) {
  return new Promise(function (resolve, reject) {
    Division.findById(req.params.id, function (err, player) {
      if (player) {
        Division.update({_id: req.params.id}, {image: req.body.image})
          .then(function (isOk) {
            Division.findById(req.params.id)
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
        reject({status: 500, message: 'Division not found'});
      }
    });
  });

}


export function listDivisions(req) {
  if (req.query.season) {
    return Division.find({season: req.query.season})
  }
  return Division.find();
}

export function createDivision(data, user) {
  if (user.isAdmin) {
    const division = new Division(data);
    return division.save();
  } else {
    return new Promise(function (resolve, reject) {
      reject({
        status: 403,
        msg: 'Forbidden'
      });
    })
  }
}

export function deleteDivision(id) {
  return Division.findById(id).remove();
}

