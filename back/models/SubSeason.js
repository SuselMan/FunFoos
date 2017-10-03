/**
 * Created by pavluhin on 03.10.2017.
 */

import mongoose from "mongoose";
import autoIncrement from 'mongoose-autoincrement';

const Schema = mongoose.Schema;

const SubSeasonSchema = new Schema({
  season: {type: Boolean},
  city: {type: Number}
});
SubSeasonSchema.plugin(autoIncrement, 'SeasonSchema');
const SubSeason = mongoose.model('SubSeason', SubSeasonSchema);