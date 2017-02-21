/**
 * Created by pavluhin on 21.02.2017.
 */

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email:{
        type: String,
        unique: true,
        required: true
    },
    password     : {
        type: String,
        required: true
    },
});

const User = mongoose.model('User', UserSchema);