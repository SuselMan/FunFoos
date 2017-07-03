/**
 * Created by pavluhin on 24.04.2017.
 */

import mongoose from "mongoose";
import '../models/Place';

const Place = mongoose.model('Place');

export function changePlace(req) {
    return new Promise(function(resolve, reject) {
        Place.findById(req.params.id,function(err,Place){
            if(Place){
                Place.update({_id:req.params.id},{image:req.body.image})
                    .then(function (isOk) {
                        Place.findById(req.params.id)
                            .then(function(Place){
                                resolve(Place);
                            })
                            .catch(function(err){
                                console.error(err);
                                reject(err);
                            })
                    })
                    .catch(function (err) {
                        reject(err);
                    })
            } else {
                reject({status:500,message:'Place not found'});
            }
        });
    });

}


export function listPlaces(req) {
    if(req.param('owner')){
        return Place.find({ owner: req.param('owner') })
    }
    return Place.find();
}

export function createPlace(data) {
    const team = new Place({
        name:data.name,
        address  : data.address,
        image:data.image,
        comment:data.comment

    });

    return team.save();
}

export function deletePlace(id) {
    return Place.findById(id).remove();
}

