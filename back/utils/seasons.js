/**
 * Created by pavluhin on 29.03.2017.
 */

import mongoose from "mongoose";
import '../models/Season';
import moment from 'moment';
import config from '../etc/config.json';

const Season = mongoose.model('Season');

export function listSeasons(req) {
  if (req && req.query.state) {
    return Season.find({state: req.query.state})
  }
  return Season.find();
}

export function createSeason(data) {
  const team = new Season({
    name: data.name
  });

  return team.save();
}

export function getSeason(req) {
  return new Promise(function(resolve, reject) {
    Season.findById(req.params.id,function(err,team){
      if(team){
        resolve(team);
      } else {
        reject({status:500,message:'User not found'});
      }
    });
  });
}

function eachWithEach(teams, season) {
  var meetings = [];
  teams.forEach((item, i, arr) => {
    for (let j = i + 1; j < teams.length; j++) {
      meetings.push(
        {
          host: item._id,
          guest: arr[j]._id,
          owner: season
        },
        {
          host: arr[j]._id,
          guest: item._id,
          owner: season
        }
      );
    }
  });
  return meetings;
}


export function changeSeason(req) {
  if (req.body.state && req.body.state === 2) {
    this.startSeason(req.params.id);
  }
  return new Promise(function (resolve, reject) {
    Season.findById(req.params.id, function (err, season) {
      if (season) {
        Season.update({_id: req.params.id}, req.body)
          .then(function (isOk) {
            Season.findById(req.params.id)
              .then(function (season) {
                resolve(season);
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
        reject({status: 500, message: 'Season not found'});
      }
    });
  });

}

export function startSeason(id) {
  console.info('Start season', id);
  const structure = config.meetingStructire;
  const games = [];
  this.listTeams(null).then((teams) => {
    if (teams && teams.length > 1) {
      this.createMeetings(eachWithEach(teams, parseInt(id)))
        .then((result) => {
          for(let i = 0; i< result.length; i++){
            for(let j = 0; j < structure.length; j++){
              games.push({
                meeting: result[i]._id,
                season: id,
                type: structure[j]
              })
            }
          }
          this.createGames(games)
        })
        .catch((err) => {
          console.error('Something wrong', err);
        })
    }
  });
}