/**
 * Created by ilya on 20.02.2017.
 */

import mongoose from 'mongoose';
import config from '../etc/config.json';
import moment from 'moment';

export function setUpConnection() {
    let connection= mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`)
    return connection;
}

export * from './teams';
export * from './players';
export * from './users';
export * from './seasons';
export * from './meetings';
export * from './places';

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
    console.log('lol',i);
    if (i < meetings.length) {
        console.log('hey');
        this.createMeeting(meetings[i])
          .then(function () {
            saveMeetingsInDB.call(this,meetings, i+1);
        }.bind(this))
          .catch(function(e){
              console.log("error",e);
          })
    }
}

export function startSeason(id) {
    var meetings = [];
    this.listTeams(null).then(function (teams) {
        if (teams && teams.length) {
            for (var i = 0; i < teams.length - 1; i++) {
                meetings = meetings.concat(createMeetingsForTeam(teams[i], teams.slice(i + 1), i));
            }
            console.log(meetings);
            saveMeetingsInDB.call(this,meetings,0);
        }
    }.bind(this))
}