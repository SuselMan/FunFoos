/**
 * Created by ipavl on 15.06.2017.
 */

import mongoose from "mongoose";
import autoIncrement from 'mongoose-autoincrement';
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    winners     : { type: Array,required: true },
    losers     : { type: Array,required: true },
    meeting  : { type: Number, required: true},
    score  : { type: Array, required: true},
    season  : { type: Number},
    approved:{type:Boolean}
});
GameSchema.plugin(autoIncrement, 'GameSchema');
const Game = mongoose.model('Game', GameSchema);