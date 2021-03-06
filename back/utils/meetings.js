/**
 * Created by pavluhin on 24.04.2017.
 */
"use strict";

import mongoose from "mongoose";
import '../models/Meeting';

const Meeting = mongoose.model('Meeting');


//TODO: Refactor

export function getMeeting(req) {
  return new Promise(function(resolve, reject) {
    Meeting.findById(req.params.id,function(err,meeting){
      if(meeting){
        resolve(meeting);
      } else {
        reject({status:500,message:'User not found'});
      }
    });
  });
}

export function changeMeeting(req) {
  return new Promise(function(resolve, reject) {
    Meeting.findById(req.params.id,function(err,meeting){
      if(meeting){
        Meeting.update({_id:req.params.id},req.body)
          .then(function (isOk) {
            Meeting.findById(req.params.id)
              .then(function(meeting){
                resolve(meeting);
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
        reject({status:500,message:'Meeting not found'});
      }
    });
  });
}

export function listMeetings(req) {
  if(req.query.owner){
    // return Meeting.find({}).or([{ guest:  req.query.owner  }, { host:  req.query.owner  }])
    return Meeting.find({ owner: req.query.owner  });
  }
  return Meeting.find();
}

export function createMeeting(data) {
  const meeting = new Meeting({
    date: data.date,
    place: data.place,
    host: data.host,
    guest: data.guest,
    owner: data.owner
  });
  return meeting.save();
}

export function createMeetings(dataArr) {
    return new Promise ((resolve, reject) => {
        Meeting.create(dataArr,(err, res) =>{
            if(err){
                reject(err);
            } else {
                resolve(res)
            }
        });
    })
}

export function deleteMeeting(id) {
  return Meeting.findById(id).remove();
}
