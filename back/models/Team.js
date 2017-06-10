/**
 * Created by pavluhin on 21.02.2017.
 */

import mongoose from "mongoose";
import autoIncrement from 'mongoose-autoincrement';
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    name     : { type: String,required: true },
    shortName     : { type: String,required: true },
    owner  : { type: Number, required: true}, // it is user
    image  : { type: String},
    season  : { type: Number},
});
TeamSchema.plugin(autoIncrement, 'TeamSchema');
const Team = mongoose.model('Team', TeamSchema);