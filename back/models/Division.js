/**
 * Created by pavluhin on 03.10.2017.
 */

import mongoose from "mongoose";
import autoIncrement from 'mongoose-autoincrement';

const Schema = mongoose.Schema;

const DivisionSchema = new Schema({
  name: {type: String},
  rounds: {type: Number},
  meetingStructure: {type: Array},
  subseason:{type:Number, required: true},
  season:{type:Number, required: true},
  penalty: {type:Boolean}
});
DivisionSchema.plugin(autoIncrement, 'DivisionSchema');
const Division = mongoose.model('Division', DivisionSchema);