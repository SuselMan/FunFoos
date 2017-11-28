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
    return Season.find({ state: req.query.state })
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
  return new Promise(function (resolve, reject) {
    Season.findById(req.params.id, function (err, team) {
      if (team) {
        resolve(team);
      } else {
        reject({ status: 500, message: 'User not found' });
      }
    });
  });
}

function getMeetings(teams, division) {
  const meetings = [];
  teams.forEach((team1, index) => {
    teams.slice(index).forEach((team2) => {
      if (team1 !== team2) {
        let direction = true;
        for (let i = 0; i < division.rounds; i++) {
          if (direction) {
            meetings.push({
              host: team1._id,
              guest: team2._id,
              owner: division._id
            });
          } else {
            meetings.push({
              host: team2._id,
              guest: team1._id,
              owner: division._id
            });
          }
          direction = !direction;
        }
      }
    });
  });
  return meetings;
}

function getGames(meetings, structure, divisionID, seasonID) {
  const games = [];
  for (let i = 0; i < meetings.length; i++) {
    for (let j = 0; j < structure.length; j++) {
      games.push({
        meeting: meetings[i]._id,
        division: divisionID,
        season: seasonID,
        type: structure[j],
        isPenalty: false
      })
    }
  }
  return games;
}


export function changeSeason(req) {
  if (req.body.state && req.body.state === 2) {
    return this.calculateSeason(req.params.id)
  }
  return new Promise(function (resolve, reject) {
    Season.findById(req.params.id, function (err, season) {
      if (season) {
        Season.update({ _id: req.params.id }, req.body)
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
        reject({ status: 500, message: 'Season not found' });
      }
    });
  });

}

export function calculateDivision(division, seasonID) {
  console.log('calculateDivision', division);
  const id = division._id;
  return new Promise((resolve, reject) => {
    const structure = division.meetingStructure;
    const games = [];
    this.listTeams({ query: { division: id } }).then((teams) => {
      if (teams && teams.length > 1) {
        console.log('find teams', teams.length);
        this.createMeetings(getMeetings(teams, division))
          .then((result) => {
            this.createGames(getGames(result, structure, id, seasonID))
              .then(() => {
                  resolve();
                }
              )
              .catch((err) => {
                reject({ msg: `Не удалось создать игры для встречи ${result._id}, "${err}"`, code: 500 })
              })
          })
          .catch((err) => {
            reject({ msg: `Не удалось создать встречи для дивизиона ${id}, "${err}"`, code: 500 });
          })
      } else {
        reject({ msg: `Слишком мало команд в дивизионе: ${id}`, code: 403 })
      }
    });
  })
}

export function calculateSeason(id) {
  console.log('calculateSeason', id);
  return new Promise((resolve, reject) => {
    const promises = [];
    const divisions = this.listDivisions({ query: { season: id } });
    divisions.then((result) => {
      console.log('find divisions', result.length);
      if (!result || !result.length) {
        reject({ msg: 'Не создано ни одного дивизиона', code: 403 });
      } else {
        for (let i = 0; i < result.length; i++) {
          promises.push(this.calculateDivision(result[i], id));
        }
        Promise.all(promises)
          .then((res) => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          })
      }
    });
  });
}
