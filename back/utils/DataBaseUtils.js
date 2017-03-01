/**
 * Created by ilya on 20.02.2017.
 */

import mongoose from "mongoose";
import config from '../etc/config.json';
import crypto from 'crypto';
import '../models/Team';
import '../models/User'

const Team = mongoose.model('Team');
const User = mongoose.model('User');

export function setUpConnection() {
    return mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`)
}

export function listTeams(id) {
    return Team.find();
}

export function createTeam(data) {
    const team = new Team({
        name: data.name,
        shortName: data.shortName
    });

    return team.save();
}

export function deleteTeam(id) {
    return Team.findById(id).remove();
}

export function createUser(userData){
    console.log(userData);
    var user = {
        name: userData.name,
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