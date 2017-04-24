/**
 * Created by pavluhin on 24.04.2017.
 */

import mongoose from "mongoose";
import '../models/Meeting';

const Meeting = mongoose.model('Meeting');


//TODO: Refactor
export function changeMeeting(req) {
  return new Promise(function(resolve, reject) {
    Meeting.findById(req.params.id,function(err,meeting){
      if(meeting){
        Meeting.update({_id:req.params.id},{image:req.body.image})
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
  if(req.param('owner')){
    return Meeting.find({ owner: req.param('owner') })
  }
  return Meeting.find();
}

export function createMeeting(data) {
  const meeting = new Meeting({
    date: data.date,
    place: data.place,
    host: data.host,
    guest: data.guest,
    season: data.season
  });
  return meeting.save();
}

export function deleteMeeting(id) {
  return Meeting.findById(id).remove();
}
