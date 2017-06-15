/**
 * Created by ilya on 20.02.2017.
 */

import mongoose from 'mongoose';
import config from '../etc/config.json';

export function setUpConnection() {
    return mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`);
}

export * from './teams';
export * from './players';
export * from './users';
export * from './seasons';
export * from './meetings';
export * from './places';
export * from './games';


//TODO think about baseUtil class and just extend it
