/**
 * Created by pavluhin on 21.02.2017.
 */

import mongoose from "mongoose";
import autoIncrement from 'mongoose-autoincrement';
const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
    name:{type:String},
    days: [Boolean],
    work:[Date],
    address  : { type: String},
    meetings : [Number]
});
PlaceSchema.plugin(autoIncrement, 'PlaceSchema');

const Place = mongoose.model('Place', PlaceSchema)