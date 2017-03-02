/**
 * Created by pavluhin on 21.02.2017.
 */

import mongoose from "mongoose";
import autoIncrement from 'mongoose-autoincrement';
const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
    workFrom     : { type: Date,required: true },
    workTo     : { type: Date,required: true },
    address  : { type: String},
    meetings : [Number]
});
PlaceSchema.plugin(autoIncrement, 'PlaceSchema');

const Place = mongoose.model('Place', PlaceSchema)