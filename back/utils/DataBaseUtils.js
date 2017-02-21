/**
 * Created by ilya on 20.02.2017.
 */

import mongoose from "mongoose";
import config from '../etc/config.json';
import '../models/Team';

const Team = mongoose.model('Team');

export function setUpConnection() {
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