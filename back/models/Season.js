/**
 * Created by pavluhin on 27.02.2017.
 */

import mongoose from "mongoose";
import autoIncrement from 'mongoose-autoincrement';

const Schema = mongoose.Schema;

const SeasonSchema = new Schema({
    name:[String],
    startDate  : { type: Date},
    endDate  : { type: Date},
    teams  : [Number],
    places:[Number],
    meetings:[Number],
    isEnd:[Boolean],
    devisions:{type: Number}
});
SeasonSchema.plugin(autoIncrement, 'SeasonSchema');
const Season = mongoose.model('Season', SeasonSchema);