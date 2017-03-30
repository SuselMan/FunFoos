/**
 * Created by pavluhin on 29.03.2017.
 */

import mongoose from "mongoose";
import '../models/User';
import crypto from 'crypto';

const User = mongoose.model('User');



export function createUser(userData){
    var user = {
        team: userData.team,
        email: userData.email,
        password: hash(userData.password)
    };
    return new User(user).save()
}

export function checkUser(userData){
    return User
        .findOne({email: userData.email})
        .then(function(doc){
            if ( doc.password == hash(userData.password) ){
                return Promise.resolve(doc);
            } else {
                return Promise.reject("Error wrong");
            }
        })
}

export function checkSession(id){
    return User.findById(id)
}

export function getUser (userData){
    return User.findOne(id)
}

export function changeUser(req) {
    return new Promise(function(resolve, reject) {
        User.findById(req.params.id,function(err,user){
            if(user){
                User.update({_id:req.params.id},{team:req.body.team})
                    .then(function (isOk) {
                        User.findById(req.params.id)
                            .then(function(user){
                                resolve(user);
                            });
                    })
                    .catch(function (err) {
                        reject(err);
                    })
            } else {
                reject({status:500,message:'User not found'});
            }
        });
    });

}

function hash(text){
    return crypto.createHash('sha1')
        .update(text).digest('base64')
}