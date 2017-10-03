/**
 * Created by pavluhin on 03.10.2017.
 */

import mongoose from "mongoose";
import autoIncrement from 'mongoose-autoincrement';

const Schema = mongoose.Schema;

const DivisionSchema = new Schema({
  rounds: {type: Number},
  meetingStructure: {type: Array},
  subSeason:{type:Number, required: true},
  penalty: {type:Boolean}
});
DivisionSchema.plugin(autoIncrement, 'DivisionSchema');
const Division = mongoose.model('Division', SeasonSchema);