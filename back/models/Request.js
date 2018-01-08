/**
 * Created by pavluhin on 06.04.2017.
 */

import mongoose from "mongoose";
import autoIncrement from 'mongoose-autoincrement';

const Schema = mongoose.Schema;

// ALLOWED TYPES:
// addTeam;

const RequestSchema = new Schema({
  type: {type: String, required: true},
  target: {type: Number, required: true},
  body: {type: Object},
  author: {type: Number}
});

RequestSchema.plugin(autoIncrement, 'RequestSchema');
const Request = mongoose.model('Request', RequestSchema);
