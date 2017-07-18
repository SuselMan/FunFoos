/**
 * Created by ipavl on 15.06.2017.
 */

import mongoose from "mongoose";
import autoIncrement from 'mongoose-autoincrement';
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    hostPlayers     : { type: Array},
    guestPlayers     : { type: Array},
    meeting  : { type: Number, required: true},
    hostScore  : { type: Array},
    guestScore  : { type: Array},
    season  : { type: Number, required:true},
    type:{ type: Number},
    approved:{type:Boolean} // game doesn't participate in statictics if false
});
GameSchema.plugin(autoIncrement, 'GameSchema');
const Game = mongoose.model('Game', GameSchema);