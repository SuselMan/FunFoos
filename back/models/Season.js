/**
 * Created by pavluhin on 27.02.2017.
 */

/**
 * Created by pavluhin on 21.02.2017.
 */

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const SeasonSchema = new Schema({
    startDate  : { type: Date, required: true },
    endDate  : { type: Date, required: true },
    teams  : [Number],
    blockedTeams:[Number],
    places:[Number]
});

const Season = mongoose.model('Team', SeasonSchema);