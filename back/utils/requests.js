/**
 * Created by pavluhin on 29.03.2017.
 */

import mongoose from "mongoose";
import '../models/Request';
const Request = mongoose.model('Request');

export function listRequests(req) {
    // if(req && req.query.owner){
    //     return Request.find({ owner: req.query.owner })
    // }
    // if(req && req.query.division){
    //     return Request.find({ division: req.query.division })
    // }
    return Request.find();
}

export function getRequest(req) {
    return new Promise(function(resolve, reject) {
        Request.findById(req.params.id,function(err,request){
            if(request){
                resolve(request);
            } else {
                reject({status:500,message:'User not found'});
            }
        });
    });
}

export function createRequest(data) {
    // TODO: this is unsafe copy only allowed params
    const request = new Request(data);

    return request.save();
}

export function changeRequest(req) {
    return new Promise(function(resolve, reject) {
        Request.findById(req.params.id,function(err,request){
            if(request){
                Request.update({_id:req.params.id},req.body)
                    .then(function (isOk) {
                        Request.findById(req.params.id)
                            .then(function(request){
                                resolve(request);
                            });
                    })
                    .catch(function (err) {
                        reject(err);
                    })
            } else {
                reject({status:500,message:'Request not found'});
            }
        });
    });

}

export function deleteRequest(id) {
    return Request.findById(id).remove();
}
