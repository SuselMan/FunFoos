/**
 * Created by pavluhin on 29.03.2017.
 */

import mongoose from "mongoose";
import '../models/Season';
import moment from 'moment';
import config from '../etc/config.json';

const Season = mongoose.model('Season');

export function listSeasons(req) {
    if (req &&req.query.state) {
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

function saveMeetingsInDB(meetings, i, season) {
    if (i < meetings.length) {
        this.createMeeting(meetings[i])
            .then(function (result) {
                for (var j = 0; j < config.meetingStructire.length; j++) {
                    this.createGame({
                        meeting: result._id,
                        season: season,
                        type: config.meetingStructire[j],
                        approved: false
                    });
                }
                saveMeetingsInDB.call(this, meetings, i + 1, season);
            }.bind(this))
            .catch(function (e) {
                console.error("error", e);
            })
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
    console.info('Start season', id);
    this.listTeams(null).then(function (teams) {
        if (teams && teams.length > 1) {
            saveMeetingsInDB.call(this, eachWithEach(teams, parseInt(id)), 0, id);
        }
    }.bind(this))
}