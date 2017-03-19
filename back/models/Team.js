/**
 * Created by pavluhin on 21.02.2017.
 */

import mongoose from "mongoose";
import autoIncrement from 'mongoose-autoincrement';
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    name     : { type: String,required: true },
    shortName     : { type: String,required: true },
    owner  : { type: Number},
    image  : { type: String},
    players  : [Number],
    meetings  : [Number]
});
TeamSchema.plugin(autoIncrement, 'TeamSchema');
const Team = mongoose.model('Team', TeamSchema);