/**
 * Created by pavluhin on 03.10.2017.
 */

import mongoose from "mongoose";
import autoIncrement from 'mongoose-autoincrement';

const Schema = mongoose.Schema;

const CitySchema = new Schema({
  name     : { type: String,required: true },
  image: {type: String}
});
CitySchema.plugin(autoIncrement, 'CitySchema');
const City = mongoose.model('City', CitySchema);