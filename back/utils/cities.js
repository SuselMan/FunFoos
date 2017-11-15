/**
 * Created by pavluhin on 29.03.2017.
 */

import mongoose from "mongoose";
import '../models/City';
const City = mongoose.model('City');

export function listCities(req) {
    if(req && req.query.owner){
        return City.find({ owner: req.query.owner })
    }
    return City.find();
}

export function getCity(req) {
    return new Promise(function(resolve, reject) {
        City.findById(req.params.id,function(err,team){
            if(team){
                resolve(team);
            } else {
                reject({status:500,message:'User not found'});
            }
        });
    });
}

export function createCity(data) {
    const team = new City({
        name: data.name,
        image: data.image || null
    });

    return team.save();
}

export function changeCity(req) {
    return new Promise(function(resolve, reject) {
        City.findById(req.params.id,function(err,team){
            if(team){
                City.update({_id:req.params.id},req.body)
                    .then(function (isOk) {
                        City.findById(req.params.id)
                            .then(function(team){
                                resolve(team);
                            });
                    })
                    .catch(function (err) {
                        reject(err);
                    })
            } else {
                reject({status:500,message:'City not found'});
            }
        });
    });

}

export function deleteCity(id) {
    return City.findById(id).remove();
}