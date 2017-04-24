/**
 * Created by ilya on 20.02.2017.
 */

import mongoose from "mongoose";
import config from '../etc/config.json';

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

export function startSeason(id) {
    var teams = listTeams(req);
}
