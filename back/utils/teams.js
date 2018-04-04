/**
 * Created by pavluhin on 29.03.2017.
 */

import mongoose from "mongoose";
import '../models/Team';

const Team = mongoose.model('Team');

export function listTeams(req, meetings) {
  if (req && req.query.owner) {
    return Team.find({owner: req.query.owner})
  }
  if (req && req.query.division) {
    return Team.find({division: req.query.division})
  }
  return Team.find().then((teams) => {
    const teamsList = [];
    teams.forEach((team) => {
      const paticipate = meetings.filter((meeting) => {
        return meeting.approved && (meeting.guest === team._id || meeting.host === team._id);
      });
      const wins = paticipate.filter((meeting) => meeting.winner === team._id).length;
      const loses = paticipate.filter((meeting) => (meeting.winner && meeting.winner !== team._id)).length;
     const stats = {
       wins,
       loses,
       score: wins- loses,
       winRate: wins ? Math.floor((wins/paticipate.length) * 100) : 0
     };
      teamsList.push(Object.assign({}, team.toJSON(), stats));
    });
    return teamsList;
  })
}

export function getTeam(req) {
  return new Promise(function (resolve, reject) {
    Team.findById(req.params.id, function (err, team) {
      if (team) {
        resolve(team);
      } else {
        reject({status: 500, message: 'Team is not found'});
      }
    });
  });
}

export function createTeam(data, user) {
  if (!user.isAdmin) {
    return new Promise(function (resolve, reject) {
      reject({
        status: 403,
        msg: 'Forbidden'
      });
    });
  }
  const team = new Team({
    name: data.name,
    shortName: data.shortName,
    owner: data.owner
  });

  return team.save();
}

export function changeTeam(req, user) {
  if (!user.isAdmin) {
    return new Promise(function (resolve, reject) {
      reject({
        status: 403,
        msg: 'Forbidden'
      });
    });
  }
  return new Promise(function (resolve, reject) {
    Team.findById(req.params.id, function (err, team) {
      if (team) {
        Team.update({_id: req.params.id}, req.body)
          .then(function (isOk) {
            Team.findById(req.params.id)
              .then(function (team) {
                resolve(team);
              });
          })
          .catch(function (err) {
            reject(err);
          })
      } else {
        reject({status: 500, message: 'Team not found'});
      }
    });
  });

}

export function deleteTeam(id) {
  return Team.findById(id).remove();
}
