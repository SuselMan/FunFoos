/**
 * Created by pavluhin on 21.02.2017.
 */

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
    workFrom     : { type: Date,required: true },
    workTo     : { type: Date,required: true },
    address  : { type: String},
    meetings : [Number]
});

const Place = mongoose.model('Place', PlaceSchema)