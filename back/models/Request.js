/**
 * Created by pavluhin on 06.04.2017.
 */

import mongoose from "mongoose";
import autoIncrement from 'mongoose-autoincrement';
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
    date     : { type: Date,required: true },
    to  : { type: Number,required: true},
    meeting : {type:Number,required: true}
});

RequestSchema.plugin(autoIncrement, 'RequestSchema');
const Request = mongoose.model('Meeting', RequestSchema);