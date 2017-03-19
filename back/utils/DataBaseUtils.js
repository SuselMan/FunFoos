/**
 * Created by ilya on 20.02.2017.
 */

import mongoose from "mongoose";
import config from '../etc/config.json';
import crypto from 'crypto';
import autoIncrement from 'mongoose-autoincrement';
mongoose.plugin(autoIncrement);
mongoose.Promise = global.Promise;
import '../models/Team';
import '../models/User';
import '../models/Player';
import '../models/Season';

const Team = mongoose.model('Team');
const Player = mongoose.model('Player');
const User = mongoose.model('User');
const Season = mongoose.model('Season');

//TODO:refactor
export function setUpConnection() {
    let connection= mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`)
    return connection;
}

export function listTeams(id) {
    return Team.find();
}

export function getTeam(req) {
    return new Promise(function(resolve, reject) {
        Team.findById(req.params.id,function(err,team){
            if(team){
               resolve(team);
            } else {
                reject({status:500,message:'User not found'});
            }
        });
    });
}

export function createTeam(data) {
    const team = new Team({
        name: data.name,
        shortName: data.shortName
    });

    return team.save();
}

export function changeTeam(req) {
    return new Promise(function(resolve, reject) {
        Team.findById(req.params.id,function(err,team){
            if(team){
                Team.update({_id:req.params.id},{image:req.body.image})
                    .then(function (isOk) {
                        User.findById(req.params.id)
                            .then(function(team){
                                resolve(team);
                            });
                    })
                    .catch(function (err) {
                        reject(err);
                    })
            } else {
                reject({status:500,message:'Team not found'});
            }
        });
    });

}


export function listPlayers(id) {
    return Player.find();
}

export function createPlayer(data) {
    const team = new Player({
        firstName: data.firstName,
        secondName: data.secondName
    });

    return team.save();
}


export function changeUser(req) {
    return new Promise(function(resolve, reject) {
        User.findById(req.params.id,function(err,user){
            if(user){
                User.update({_id:req.params.id},{team:req.body.team})
                    .then(function (isOk) {
                        User.findById(req.params.id)
                            .then(function(user){
                                resolve(user);
                            });
                    })
                    .catch(function (err) {
                        reject(err);
                    })
            } else {
                reject({status:500,message:'User not found'});
            }
        });
    });

}

export function listSeasons(id) {
    return Season.find();
}

export function createSeason(data) {
    const team = new Season({
        name: data.name
    });

    return team.save();
}

export function deleteTeam(id) {
    return Team.findById(id).remove();
}

export function createUser(userData){
    console.log(userData);
    var user = {
        team: userData.team,
        email: userData.email,
        password: hash(userData.password)
    };
    return new User(user).save()
}

export function checkUser(userData){
    return User
        .findOne({email: userData.email})
        .then(function(doc){
            if ( doc.password == hash(userData.password) ){
                console.log("User password is ok");
                return Promise.resolve(doc)
            } else {
                return Promise.reject("Error wrong")
            }
        })
}

export function getUser (userData){
    return User.findOne(id)
}

function hash(text){
    return crypto.createHash('sha1')
        .update(text).digest('base64')
}