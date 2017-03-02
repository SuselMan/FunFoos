/**
 * Created by pavluhin on 21.02.2017.
 */

import mongoose from "mongoose";
import autoIncrement from 'mongoose-autoincrement';
const Schema = mongoose.Schema;

const MeetingSchema = new Schema({
    date     : { type: Date,required: true },
    place  : { type: Number},
    teams : [Number]
});
MeetingSchema.plugin(autoIncrement, 'MeetingSchema');

const Meeting = mongoose.model('Meeting', MeetingSchema);