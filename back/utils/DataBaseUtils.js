/**
 * Created by ilya on 20.02.2017.
 */

import mongoose from 'mongoose';
import config from '../etc/config.json';

export function setUpConnection() {
    //TODO: find to faster promice library;
    mongoose.Promise = global.Promise;
    return mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`);
}

export * from './teams';
export * from './players';
export * from './users';
export * from './games';
export * from './seasons';
export * from './meetings';
export * from './places';


//TODO think about baseUtil class and just extend it
