/**
 * Created by pavluhin on 21.02.2017.
 */

import mongoose from "mongoose";
import autoIncrement from 'mongoose-autoincrement';
const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
    name:{type:String},
    workTime: [Array],
    workDays: [Boolean],
    specialDays: [Array], //it is days when place suddenly don't work
    address  : { type: String},
    image:{type:String},
    link:{type:String},
    comment:{type:String}
});
PlaceSchema.plugin(autoIncrement, 'PlaceSchema');

const Place = mongoose.model('Place', PlaceSchema);