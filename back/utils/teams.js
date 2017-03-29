/**
 * Created by pavluhin on 29.03.2017.
 */

import mongoose from "mongoose";
import '../models/Team';
const Team = mongoose.model('Team');

export function listTeams(id) {
    return Team.find();
}

export function getTeam(req) {
    return new Promise(function(resolve, reject) {
        Team.findById(req.params.id,function(err,team){
            if(team){
                resolve(team);
            } else {
                reject({status:500,message:'User not found'});
            }
        });
    });
}

export function createTeam(data) {
    const team = new Team({
        name: data.name,
        shortName: data.shortName
    });

    return team.save();
}

export function changeTeam(req) {
    return new Promise(function(resolve, reject) {
        Team.findById(req.params.id,function(err,team){
            if(team){
                Team.update({_id:req.params.id},{image:req.body.image})
                    .then(function (isOk) {
                        Team.findById(req.params.id)
                            .then(function(team){
                                resolve(team);
                            });
                    })
                    .catch(function (err) {
                        reject(err);
                    })
            } else {
                reject({status:500,message:'Team not found'});
            }
        });
    });

}

export function deleteTeam(id) {
    return Team.findById(id).remove();
}