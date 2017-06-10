/**
 * Created by pavluhin on 29.03.2017.
 */

import mongoose from "mongoose";
import '../models/Season';
import moment from 'moment';

const Season = mongoose.model('Season');

export function listSeasons(req) {
    if(req && req.param('state')){
        return Season.find({ state: req.param('state') })
    }
    return Season.find();
}

export function createSeason(data) {
    const team = new Season({
        name: data.name
    });

    return team.save();
}

function createMeetingsForTeam(team, teams, index) {
    //TODO: add normal date calculating
    var meetings = [];
    for (var i = 0; i < teams.length; i++) {
        meetings.push({
            date: moment().add(index,'days').unix(),
            place: 1,
            host: teams[i]._id,
            guest: team._id,
            owner: 1
        })
        meetings.push({
            date: moment().add(index,'days').unix(),
            place: 1,
            host: team._id,
            guest: teams[i]._id,
            owner: 1
        })
    }
    return meetings;
}

function saveMeetingsInDB(meetings, i) {
    if (i < meetings.length) {
        this.createMeeting(meetings[i])
            .then(function () {
                saveMeetingsInDB.call(this,meetings, i+1);
            }.bind(this))
            .catch(function(e){
                console.error("error",e);
            })
    }
}


export function changeSeason(req) {
    if(req.body.state && req.body.state === 2){
        this.startSeason(req.params.id);
    }
    return new Promise(function(resolve, reject) {
        Season.findById(req.params.id,function(err,season){
            if(season){
                Season.update({_id:req.params.id},req.body)
                    .then(function (isOk) {
                        Season.findById(req.params.id)
                            .then(function(season){
                                resolve(season);
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
                reject({status:500,message:'Season not found'});
            }
        });
    });

}

export function startSeason(id) {
    console.log('StartSeason');
    var meetings = [];
    this.listTeams(null).then(function (teams) {
        console.log('teams',teams.length);
        if (teams && teams.length) {
            for (var i = 0; i < teams.length - 1; i++) {
                console.log('team');
                meetings = meetings.concat(createMeetingsForTeam(teams[i], teams.slice(i + 1), i));
            }
            console.log(meetings);
            saveMeetingsInDB.call(this,meetings,0);
        }
    }.bind(this))
}