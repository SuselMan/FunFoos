/**
 * Created by pavluhin on 21.02.2017.
 */

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MeetingSchema = new Schema({
    date     : { type: Date,required: true },
    place  : { type: Number},
    teams : [Number]
});

const Meeting = mongoose.model('Meeting', MeetingSchema);