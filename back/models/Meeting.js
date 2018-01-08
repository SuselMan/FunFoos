/**
 * Created by pavluhin on 21.02.2017.
 */

import mongoose from "mongoose";
import autoIncrement from 'mongoose-autoincrement';
const Schema = mongoose.Schema;

const MeetingSchema = new Schema({
    date: {type: Number},
    place: {type: Number},
    host: {type: Number, required: true},
    guest: {type: Number, required: true},
    owner: {type: Number, required: true}, //owner is division
    score: {type:Array},
    secret:{type:String}
});

MeetingSchema.plugin(autoIncrement, 'MeetingSchema');
const Meeting = mongoose.model('Meeting', MeetingSchema);
