/**
 * Created by ipavl on 15.06.2017.
 */

import mongoose from "mongoose";
import autoIncrement from 'mongoose-autoincrement';
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    hostPlayer0     : { type: Number},
    hostPlayer1     : { type: Number},
    guestPlayer0     : { type: Number},
    guestPlayer1     : { type: Number},
    meeting  : { type: Number, required: true},
    hostScore0  : { type: Number},
    guestScore0  : { type: Number},
    hostScore1  : { type: Number},
    guestScore1  : { type: Number},
    season  : { type: Number, required:true},
    division  : { type: Number, required:true},
    type:{ type: Number},
    isPenalty: {type: Boolean, required:true},
    approved:{type:Boolean}, // game doesn't participate in statictics if false
    hostApproved:{type:Boolean},
    guestApproved:{type:Boolean}
});
GameSchema.plugin(autoIncrement, 'GameSchema');
const Game = mongoose.model('Game', GameSchema);
