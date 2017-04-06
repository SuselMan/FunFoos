/**
 * Created by pavluhin on 21.02.2017.
 */

import mongoose from "mongoose";
import autoIncrement from 'mongoose-autoincrement';

const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    firstName     : { type: String,required: true },
    secondName     : { type: String,required: true },
    owner  : { type: Number},
    image : { type: String}
});
PlayerSchema.plugin(autoIncrement, 'PlayerSchema');
const Player = mongoose.model('Player', PlayerSchema);