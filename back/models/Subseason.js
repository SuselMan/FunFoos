/**
 * Created by pavluhin on 03.10.2017.
 */

import mongoose from "mongoose";
import autoIncrement from 'mongoose-autoincrement';

const Schema = mongoose.Schema;

const SubseasonSchema = new Schema({
  season: {type: Number, required: true},
  city: {type: Number, required: true}
});
SubseasonSchema.plugin(autoIncrement, 'SubseasonSchema');
const Subseason = mongoose.model('Subseason', SubseasonSchema);