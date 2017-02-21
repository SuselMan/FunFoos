/**
 * Created by pavluhin on 21.02.2017.
 */

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    name     : { type: String,required: true },
    team  : { type: Number}
});

const Player = mongoose.model('Player', PlayerSchema);