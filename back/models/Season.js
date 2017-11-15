/**
 * Created by pavluhin on 27.02.2017.
 */

import mongoose from "mongoose";
import autoIncrement from 'mongoose-autoincrement';

const Schema = mongoose.Schema;

const SeasonSchema = new Schema({
    name: {type: String, required:true},
    image: {type: String},
    startDate: {type: Date},
    endDate: {type: Date},
    state: {type: Number} // 0-closed, 1-registration is opened, 2-games is started, 3 - finished
});
SeasonSchema.plugin(autoIncrement, 'SeasonSchema');
const Season = mongoose.model('Season', SeasonSchema);