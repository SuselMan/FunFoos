/**
 * Created by ilya on 20.02.2017.
 */

import mongoose from "mongoose";
import config from '../etc/config.json';
import '../models/Team';
import '../models/User'
import crypto from 'crypto';
import session from 'express-session';
import connectMongo from 'connect-mongo';


const Team = mongoose.model('Team');
const User = mongoose.model('User');
const MongoStore = connectMongo(session);

export function setUpConnection(app) {
    mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`);
}

export function listTeams(id) {
    return Team.find();
}

export function createTeam(data) {
    const team = new Team({
        name: data.name
    });

    return team.save();
}

export function deleteTeam(id) {
    return Team.findById(id).remove();
}

export function createUser(userData){
    const user = new Team({
        name: userData.name,
        email: userData.email,
        password: hash(userData.password)
    });
    return user.save();
}

export function getUser(id) {
    return User.findOne(id)
}

export function checkUser(userData) {
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

function hash(text) {
    return crypto.createHash('sha1')
        .update(text).digest('base64')
}