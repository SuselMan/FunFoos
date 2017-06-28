/**
 * Created by pavluhin on 29.03.2017.
 */

import mongoose from "mongoose";
import '../models/Season';
import moment from 'moment';

const Season = mongoose.model('Season');

export function listSeasons(req) {
  if (req && req.param('state')) {
    return Season.find({state: req.param('state')})
  }
  return Season.find();
}

export function createSeason(data) {
  const team = new Season({
    name: data.name
  });

  return team.save();
}

function createGamesForMeeting(meetings,i) {
  
}

function saveMeetingsInDB(meetings, i) {
  if (i < meetings.length) {
    console.log('try to create',meetings[i]);
    this.createMeeting(meetings[i])
      .then(function (result) {
        console.log('Meeting saved',result)
        saveMeetingsInDB.call(this, meetings, i + 1);
      }.bind(this))
      .catch(function (e) {
        console.error("error", e);
      })
  } else {
    createGamesForMeeting(meetings,0)
  }
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
  console.log('START SEASON!!!!!!!', id);
  this.listTeams(null).then(function (teams) {
    if (teams && teams.length > 1) {
      saveMeetingsInDB.call(this, eachWithEach(teams,parseInt(id)), 0);
    }
  }.bind(this))
}