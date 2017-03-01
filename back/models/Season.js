/**
 * Created by pavluhin on 27.02.2017.
 */

import mongoose from "mongoose";
import autoIncrement from 'mongoose-auto-increment';

const Schema = mongoose.Schema;

const SeasonSchema = new Schema({
    number:[Number],
    startDate  : { type: Date},
    endDate  : { type: Date},
    teams  : [Number],
    places:[Number],
    meetings:[Number],
    isEnd:[Boolean]
});
SeasonSchema.plugin(autoIncrement.plugin, 'SeasonSchema');
const Season = mongoose.model('Season', SeasonSchema);