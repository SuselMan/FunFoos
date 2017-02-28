/**
 * Created by pavluhin on 21.02.2017.
 */

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    name     : { type: String,required: true },
    shortName     : { type: String,required: true },
    players  : [Number],
    meetings  : [Number]
});

const Team = mongoose.model('Team', TeamSchema);