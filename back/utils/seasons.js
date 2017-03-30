/**
 * Created by pavluhin on 29.03.2017.
 */

import mongoose from "mongoose";
import '../models/Season';

const Season = mongoose.model('Season');

export function listSeasons(id) {
    return Season.find();
}

export function createSeason(data) {
    const team = new Season({
        name: data.name
    });

    return team.save();
}